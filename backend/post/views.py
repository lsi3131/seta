from django.shortcuts import get_list_or_404, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from .models import *
from .validate import *


class PostCommentsAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_children_data(self, comment):
        children_data = []
        children = comment.get_children()
        for child in children:
            recommend = [r.id for r in child.recommend.all()]
            children_data.append({
                "id": child.id,
                "article": child.article.id,
                "author": child.author.username,
                "parent_comment_id": child.parent_comment_id,
                "content": child.content,
                "recommend": recommend,
                "created_at": child.created_at,
                "updated_at": child.updated_at,
                "children": self.get_children_data(child),  # 재귀적으로 자식 댓글의 자식 댓글들의 데이터도 포함합니다.
            })
        return children_data

    def get(self, request, post_pk):
        print('hello')
        return Response({'hello': 'message'}, status=status.HTTP_200_OK)
        article = get_object_or_404(Post, id=post_pk)
        comments = article.comments.all()

        response_data = []
        for comment in comments:
            recommend = [r.id for r in comment.recommend.all()]
            children_data = self.get_children_data(comment)

            response_data.append(
                {
                    "id": comment.id,
                    "article": comment.article.id,
                    "author": comment.author.username,
                    "parent_comment_id": comment.parent_comment_id,
                    "children": children_data,
                    "content": comment.content,
                    "recommend": recommend,
                    "created_at": comment.created_at,
                    "updated_at": comment.updated_at,
                }
            )

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
        article = get_object_or_404(Post, id=post_pk)
        Comment.objects.create(content=content, article=article, author=request.user, parent=parent_comment)
        return Response(
            {"message": "댓글이 작성되었습니다."},
            status=status.HTTP_201_CREATED
        )


class PostDetailAPIView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, post_pk, comment_pk):
        comment = get_object_or_404(Comment, id=comment_pk)

        parent_comment_id = comment.parent.id if comment.parent else None
        recommend = [r.id for r in comment.recommend.all()]
        return Response({
            "id": comment.id,
            "article": comment.post.id,
            "parent_id": parent_comment_id,
            "content": comment.content,
            "recommend": recommend,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
        }, status=status.HTTP_200_OK)

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
