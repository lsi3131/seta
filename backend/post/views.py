from django.shortcuts import get_list_or_404, get_object_or_404
from django.db.models import Count, F
from django.core.paginator import Paginator
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from .models import *
from .validate import *
from rest_framework.decorators import api_view, permission_classes


def serialize_post(post):
    # 추천사용자 이름을 체크하기 위해 사용
    like_usernames = [user.username for user in post.likes.all()]
    return {
        "id": post.id,
        "author": post.author.username,
        "category": post.category.name,
        "title": post.title,
        "hits": post.hits,
        "likes": post.likes.count(),
        "like_usernames": like_usernames,
        "comments": post.comments.count(),
        "mbti": [mbti.mbti_type for mbti in post.mbti.all()],
        "created_at": post.created_at,
        "updated_at": post.updated_at,
    }


def serialize_post_update(post):
    return {
        "id": post.id,
        "author": post.author.username,
        "category": post.category.name,
        "title": post.title,
        "content": post.content,
        "mbti": [mbti.mbti_type for mbti in post.mbti.all()],
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
        "author_mbti": comment.author.mbti.mbti_type,
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
    permission_classes = [AllowAny]

    # mbti게시판과 일치하는 게시글만
    def mbti_board_filter(self, mbti):
        # mbti = get_object_or_404(Mbti, mbti_type=mbti)
        mbti = Mbti.objects.filter(mbti_type__icontains=mbti).first()
        if not mbti:
            return None
        posts = Post.objects.filter(mbti=mbti)
        return posts

    def get(self, request, mbti):
        posts = self.mbti_board_filter(mbti)

        # 카테고리 필터링
        category = request.GET.get('category')
        if category:
            posts = posts.filter(category__name=category)

        # 검색 조건 필터링 [제목 / 내용 / 작성자]
        search_type = request.GET.get('searchType')
        if search_type == 'title':
            search = request.GET.get("search")
            posts = posts.filter(title__contains=search)
        elif search_type == 'content':
            search = request.GET.get("search")
            posts = posts.filter(content__contains=search)
        elif search_type == 'author':
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

        # 페이지네이션 15개씩
        per_page = 15
        paginator = Paginator(posts, per_page)
        page_number = request.GET.get("page")
        if page_number:
            posts = paginator.get_page(page_number)
        response_data = []
        for post in posts:
            response_data.append(serialize_post(post))

        paginated_response_data = {
            'total_page': paginator.num_pages,
            "per_page": per_page,
            'results': response_data,
        }

        return Response(paginated_response_data, status=status.HTTP_200_OK)


class CreatePostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()
        message = validate_post_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        title = data['title']
        content = data['content']
        category = PostCategory.objects.get(name=data['category'])
        post = Post.objects.create(title=title, category=category,
                                   content=content, author=request.user)
        mbti_types = data['mbti']
        for mbti_type in mbti_types:
            mbti_s = Mbti.objects.filter(mbti_type__icontains=mbti_type).first()
            post.mbti.add(mbti_s)

        return Response(
            {"message": "게시글이 작성되었습니다.",
             "id": post.id},
            status=status.HTTP_201_CREATED
        )


class PostCategoryAPIView(APIView):
    def get(self, request):
        categories = PostCategory.objects.all()

        serialized_categories = []
        for category in categories:
            serialized_categories.append(
                {"name": category.name}
            )
        return Response(serialized_categories, status=status.HTTP_200_OK)


class PostDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_pk):
        purpose = request.GET.get('purpose')
        post = get_object_or_404(Post, id=post_pk)

        if purpose == 'update':
            if request.user != post.author:
                return Response(
                    {"error": "작성자만 수정할 수 있습니다."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serialize = serialize_post_update(post)
            return Response(serialize, status=status.HTTP_200_OK)

        serialize = serialize_post(post)
        serialize['content'] = post.content
        return Response(serialize, status=status.HTTP_200_OK)

    def put(self, request, post_pk):
        post = get_object_or_404(Post, id=post_pk)
        if post.author != request.user:
            return Response(
                {"error": "작성자만 수정할 수 있습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )
        data = request.data.copy()
        data["content"] = data.get("content", post.content)
        data["title"] = data.get("title", post.title)
        data["category_id"] = PostCategory.objects.get(name=data.get("category", post.category))
        data["mbti"] = data.get("mbti", post.mbti)
        if data["mbti"]:
            mbti_set = []
            for mbti in data["mbti"]:
                mbti = get_object_or_404(Mbti, mbti_type=mbti)
                mbti_set.append(mbti)
            post.mbti.set(mbti_set)

        message = validate_post_data(data)
        if message:
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

        post.__dict__.update(**data)
        post = post.save()
        return Response(
            {"message": "게시글이 수정되었습니다."},
            status=status.HTTP_200_OK
        )

    def delete(self, request, post_pk):
        post = get_object_or_404(Post, id=post_pk)
        if post.author != request.user:
            return Response(
                {"error": "작성자만 삭제할 수 있습니다."},
                status=status.HTTP_400_BAD_REQUEST
            )
        post.delete()
        return Response(
            {"message": "게시글이 삭제되었습니다."},
            status=status.HTTP_204_NO_CONTENT
        )


@api_view(['PUT'])
def add_hit(request, post_pk):
    post = get_object_or_404(Post, id=post_pk)
    post.hits += 1
    post.save()

    return Response({'message': '조회수가 증가했습니다.'}, status=status.HTTP_200_OK)


class PostCommentsAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_pk):
        post = get_object_or_404(Post, id=post_pk)
        comments = post.comments.all()

        per_page = 50
        paginator = Paginator(comments, per_page)
        page_number = request.GET.get("page")
        if page_number:
            comments = paginator.get_page(page_number)

        serialized_comments = []
        for comment in comments:
            if not comment.parent:
                serialized_comments.append(serialize_comment(comment))

        paginated_response_data = {
            'total_page': paginator.num_pages,
            'per_page': per_page,
            'count': comments.count(),
            'results': serialized_comments,
        }

        return Response(paginated_response_data, status=status.HTTP_200_OK)

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
    permission_classes = [IsAuthenticatedOrReadOnly]

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

    # frontend에서 'like'요청을 보내면 '좋아요'기능 실행
    like = request.data.get('like', 0)

    if like:
        post.likes.add(user)
        return Response({'message': '좋아요'}, status=status.HTTP_200_OK)
    else:
        post.likes.remove(user)
        return Response({'message': '좋아요 취소'}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Recommend(request, post_pk, comment_pk):
    comment = get_object_or_404(Comment, pk=comment_pk)
    user = request.user.id

    # frontend에서 'recommend' 보내면 '추천'기능 실행
    Reco = request.data.get('recommend', 0)

    if Reco:
        comment.recommend.add(user)
        return Response({"message": "추천"}, status=status.HTTP_200_OK)
    else:
        comment.recommend.remove(user)
        return Response({"message": "추천 취소"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Image(request) :
    data = request.data.copy()
    message = validate_image_data(data)
    if message :
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
    name = data['name']
    image = data['image']
    PostImage.objects.create(name = name, picture = image)
    return Response({"message": "이미지 업로드 성공"}, status=status.HTTP_200_OK)