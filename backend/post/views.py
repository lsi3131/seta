from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import *
from .validate import *
from rest_framework.decorators import api_view, permission_classes


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
        "children": get_children_data(comment),  # 재귀적으로 자식 댓글의 자식 댓글들의 데이터도 포함된다.
    }


def get_children_data(comment):
    children_data = []
    children = comment.children.all()
    for child in children:
        children_data.append(serialize_comment(child))
    return children_data


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
        Comment.objects.create(content=content, post=post, author=request.user, parent=parent_comment)
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
        return Response({'message': '좋아요'})
    else:
        post.likes.remove(user)
        return Response({'message': '좋아요 취소'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Recommend(request, post_pk, comment_pk):
    comment = get_object_or_404(Comment, pk=comment_pk)
    user = request.user.id

    if request.data:    #frontend에서 데이터를 보내면 "추천"
        comment.recommend.add(user)
        return Response({ "message":"추천"})
    else:
        comment.recommend.remove(user)
        return Response({ "message":"추천 취소"})