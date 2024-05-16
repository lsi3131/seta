from django.shortcuts import get_list_or_404, get_object_or_404
from django.db.models import Count, F
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import *
from .validate import *
from rest_framework.decorators import api_view, permission_classes


def serialize_post(post):
    return {
        "id": post.id,
        "author": post.author.username,
        "category": post.category.name,
        "title": post.title,
        # "content" : post.content,
        "hits": post.hits,
        "likes": post.likes.count(),
        "comments": post.comments.count(),
        "mbti": [mbti.mbti_type for mbti in post.mbti.all()],
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def serialize_comment(comment):
    if not comment:
        return None

    recommend = [r.id for r in comment.recommend.all()]
    parent_comment_id = comment.parent.id if comment.parent else None

    return {
        "id": comment.id,
        "post": comment.post.id,
        "author": comment.author.username,
        "parent_id": parent_comment_id,
        "content": comment.content,
        "recommend": recommend,
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
        # 재귀적으로 자식 댓글의 자식 댓글들의 데이터도 포함된다.
        "children": get_children_data(comment),
    }


def get_children_data(comment):
    children_data = []
    children = comment.children.all()
    for child in children:
        children_data.append(serialize_comment(child))
    return children_data


class PostAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    # mbti게시판과 일치하는 게시글만
    def mbti_board_filter(self, mbti):
        mbti = get_object_or_404(Mbti, mbti_type=mbti)
        posts = Post.objects.filter(mbti=mbti)
        return posts

    def get(self, request, mbti):
        posts = self.mbti_board_filter(mbti)

        # 필터링 [제목 / 내용 / 작성자]
        category = request.GET.get('category')
        if category == 'title':
            search = request.GET.get("search")
            posts = posts.filter(title__contains=search)
        elif category == 'content':
            search = request.GET.get("search")
            posts = posts.filter(content__contains=search)
        elif category == 'author':
            search = request.GET.get("search")
            posts = posts.filter(author__username__contains=search)

        # 정렬 [좋아요순 / 최근순 / 댓글순]
        order = request.GET.get("order")
        if order == 'like':
            posts = posts.annotate(like_count=Count(
                F('likes'))).order_by('-like_count')
        elif order == 'recent':
            posts = posts.order_by('-created_at')
        elif order == 'comment':
            posts = posts.annotate(comment_count=Count(
                F('comments'))).order_by('-comment_count')

        # 페이지네이션 30개씩
        paginator = Paginator(posts, 30)
        page_number = request.GET.get("page")
        if page_number:
            posts = paginator.get_page(page_number)

        response_data = []
        for post in posts:
            response_data.append(serialize_post(post))

        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, mbti):
        data = request.data.copy()
        message = validate_post_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        title = data['title']
        content = data['content']
        category = PostCategory.objects.get(name = data['category'])
        post = Post.objects.create(title=title, category=category,
                            content=content,author=request.user)
        mbti_types = data['mbti']
        for mbti in mbti_types:
            mbti = get_object_or_404(Mbti, mbti_type=mbti)
            post.mbti.add(mbti)
            
        return Response(
            {"message": "게시글이 작성되었습니다."},
            status=status.HTTP_201_CREATED
        )
    
    #post만 authenticated
    def dispatch(self, request, mbti):
        if request.method == 'POST':
            self.permission_classes = [IsAuthenticated]
        else:
            self.permission_classes = []
        return super().dispatch(request, mbti)


class PostCommentsAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_pk):
        post = get_object_or_404(Post, id=post_pk)
        comments = post.comments.all()

        response_data = []
        for comment in comments:
            response_data.append(serialize_comment(comment))

        return Response(response_data, status=status.HTTP_200_OK)

    def post(self, request, post_pk):
        data = request.data.copy()
        message = validate_comment_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        content = data['content']
        parent_comment_id = data.get('parent_comment_id', None)
        parent_comment = None
        if parent_comment_id:
            parent_comment = get_object_or_404(Comment, id=parent_comment_id)
        post = get_object_or_404(Post, id=post_pk)
        Comment.objects.create(content=content, post=post,
                               author=request.user, parent=parent_comment)
        return Response(
            {"message": "댓글이 작성되었습니다."},
            status=status.HTTP_201_CREATED
        )


class PostCommentDetailAPIView(APIView):
    # permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)

        comment_data = serialize_comment(comment)

        return Response(comment_data, status=status.HTTP_200_OK)

    def put(self, request, post_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)
        if comment.author != request.user:
            return Response(
                {"error": "작성자만 수정할 수 있습니다."},
                status=status.HTTP_403_FORBIDDEN
            )
        data = request.data.copy()
        data["content"] = data.get("content", comment.content)
        message = validate_comment_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        comment.__dict__.update(**data)
        comment.save()
        return Response(
            {"message": "댓글이 수정되었습니다."},
            status=status.HTTP_200_OK
        )

    def delete(self, request, post_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)
        if comment.author != request.user:
            return Response(
                {"error": "작성자만 삭제할 수 있습니다."},
                status=status.HTTP_403_FORBIDDEN
            )
        comment.delete()
        return Response(
            {"message": "댓글이 삭제되었습니다."},
            status=status.HTTP_204_NO_CONTENT
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def LikeyPost(request, post_pk):
    post = get_object_or_404(Post, pk=post_pk)
    user = request.user.id 

    if request.data:    #frontend에서 데이터를 보내면 '좋아요'
        post.likes.add(user)
        return Response({'message': '좋아요'},status=status.HTTP_200_OK)
    else:
        post.likes.remove(user)
        return Response({'message': '좋아요 취소'},status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Recommend(request, post_pk, comment_pk):
    comment = get_object_or_404(Comment, pk=comment_pk)
    user = request.user.id

    if request.data:    #frontend에서 데이터를 보내면 "추천"
        comment.recommend.add(user)
        return Response({ "message":"추천"},status=status.HTTP_200_OK)
    else:
        comment.recommend.remove(user)
        return Response({ "message":"추천 취소"},status=status.HTTP_200_OK)