# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.decorators import permission_classes
# from rest_framework.permissions import IsAuthenticated, IsAdminUser

# from rest_framework.decorators import permission_classes

# from rest_framework import generics
# from ..serializers import *
# from rest_framework import status
# from django.shortcuts import get_object_or_404


# import logging
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.permissions import IsAuthenticated

# logger = logging.getLogger(__name__)


# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
# from django.core.exceptions import ValidationError
# from django.db import transaction




# from rest_framework.views import APIView
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
# from rest_framework.exceptions import ValidationError
# from django.db import transaction


# logger = logging.getLogger(__name__)

# class UploadVideo(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     @transaction.atomic
#     def post(self, request):
#         try:
#             data = request.data

#             post_id = data.get('post_id')
#             post = Post.objects.get(id=post_id)

#             vid = request.FILES.get('video')
#             if vid is None:
#                 raise ValidationError("No video file provided")

#             self.validate_video_size(vid)

#             # Upload the video to Supabase
#             video_url = upload_file_to_supabase(vid, BUCKET_NAME, f"videos/{vid.name}")

#             # Update the post with the uploaded video URL
#             post.video = video_url
#             # Set isSlice to True
#             post.isSlice = True
#             post.save()

#             # Create a Video object to store the video URL
#             Video.objects.create(post=post, video=video_url)

#             return Response({'detail': 'Video was uploaded successfully'})
#         except ValidationError as e:
#             error_message = "Validation Error: " + str(e)
#             logger.error(f'Error uploading video: {error_message}')
#             print(error_message)  # Print error to console
#             return Response({'detail': error_message}, status=400)
#         except Exception as e:
#             error_message = "Internal Server Error: " + str(e)
#             logger.error(f'Error uploading video: {error_message}')
#             print(error_message)  # Print error to console
#             return Response({'detail': error_message}, status=500)

#     def validate_video_size(self, file):
#         max_size = 419430400  # Maximum size in bytes (400 MB)
#         if file.size > max_size:
#             raise ValidationError("Maximum size for video is 400 MB")



# from base.utils import upload_file_to_supabase
# import logging


# logger = logging.getLogger(__name__)
# class UploadAlbum(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request):
#         try:
#             data = request.data

#             post_id = data.get('post_id')
#             post = Post.objects.get(id=post_id)

#             # Assuming the files are sent as 'albums' field in the request
#             albums = request.FILES.getlist('albums')

#             # Set the first image as the post's main image
#             if albums:
#                 # main_image_url = upload_file_to_supabase(albums[0], BUCKET_NAME, f"images/{albums[0].name}")
#                 post.save()

#             for album in albums:
#                 album_url = upload_file_to_supabase(album, BUCKET_NAME, f"images/{album.name}")
#                 post.image = album_url
#                 post.save()
#                 PostImage.objects.create(post=post, album=album_url)

#             return Response({'detail': 'Images were uploaded successfully'})
#         except Exception as e:
#             logger.error(f'Error uploading images: {str(e)}')
#             return Response({'detail': 'Internal Server Error'}, status=500)





# class deleteComment(APIView):
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, pk):
#         comment = get_object_or_404(Comment, id=pk)

#         # Check if the user is either the author of the comment or the owner of the post
#         if request.user == comment.user or request.user == comment.post.user:
#             comment.delete()
#             return Response("The Comment Was Deleted Successfully")
#         else:
#             return Response("You are not allowed to delete this comment", status=403)



# class deletePost(APIView):
#     permission_classes = [IsAuthenticated]

#     def delete(self, request, pk):
#         post = get_object_or_404(Post, id=pk)

#         # Check if the user is either the author of the post or the owner of the post
#         if request.user == post.user :
#             post.delete()
#             return Response("The Post Was Deleted Successfully")
#         else:
#             return Response("You are not allowed to delete this post", status=403)


# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.pagination import PageNumberPagination


# class GetPostsView(APIView):
#     def get(self, request):
#         # Retrieve posts excluding posts from private accounts
#         qs = Post.objects.filter(
#             user__isPrivate=False,  # Exclude posts from private accounts
#         )

#         qs = qs.exclude(albums__isnull=True)

#         name = request.query_params.get('name')
#         if name is not None:
#             qs = qs.filter(caption__icontains=name)

#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10  # Set the number of posts per page
#         result_page = paginator.paginate_queryset(qs, request)

#         serializer = PostSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)





# class GetSlicesView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         following = user.following.all()
#         # Retrieve posts where isSlice is True

#         if not following:
#             return Response({"detail": "You are not following anyone yet."})


#         vs = Post.objects.filter( isSlice=True).order_by('-created_date')


#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10  # Set the number of posts per page
#         result_page = paginator.paginate_queryset(vs, request)

#         serializer = PostSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)


# class GetPost(APIView):
#     def get(self, request, pk):
#         post = Post.objects.get(id=pk)
#         serializer = PostSerializer(post, many=False)
#         return Response(serializer.data)

# from notifications.models import *


# @permission_classes([IsAuthenticated])
# class LikePost(APIView):
#     def post(self, request, pk):
#         liker = request.user
#         post = Post.objects.get(id=pk)

#         # 1. If Follower already exists
#         already_exists = Like.objects.filter(liker=liker, post=post).exists()

#         if already_exists:
#             # If Follower already exists, delete it (unfollow)
#             Like.objects.filter(liker=liker, post=post).delete()
#             return Response('Like Removed')

#         else:
#             # If Follower doesn't exist, create it (follow)
#             like = Like.objects.create(
#                 liker=liker,
#                 post=post,
#             )

#             notice = Notice.objects.create(
#                 user=post.user,
#                 message=f"{liker.username} liked your Post",
#                 notification_type='like',
#             )
#             return Response('Post Liked')




# @permission_classes([IsAuthenticated])
# class BookmarkPost(APIView):
#     def post(self, request, pk):
#         booker = request.user
#         post = Post.objects.get(id=pk)

#         # 1. If Follower already exists
#         already_exists = Bookmark.objects.filter(booker=booker, post=post).exists()

#         if already_exists:
#             # If Follower already exists, delete it (unfollow)
#             Bookmark.objects.filter(booker=booker, post=post).delete()
#             return Response('Bookmark Removed')

#         else:
#             # If Follower doesn't exist, create it (follow)
#             bookmark = Bookmark.objects.create(
#                 booker=booker,
#                 post=post,
#             )
#             return Response('Post Bookmarked')

# from rest_framework.exceptions import ValidationError

# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from rest_framework.permissions import IsAuthenticated
# from django.shortcuts import get_object_or_404
# from django.core.exceptions import ValidationError
# from better_profanity import profanity


# class createComment(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, pk):
#         user = request.user
#         post = get_object_or_404(Post, id=pk)

#         # Check if the post owner is private and the commenting user is a follower
#         post_owner = post.user
#         followers = post_owner.followers.all()
#         is_follower = followers.filter(custom_id=user.id).exists()

#         if post_owner.isPrivate and not is_follower:
#             return Response({'detail': 'You are not allowed to comment on this post.'}, status=status.HTTP_403_FORBIDDEN)

#         data = request.data
#         comment_message = data.get('message', '')

#         # Check if the comment already exists
#         already_exists = Comment.objects.filter(user=user, post=post).exists()

#         if already_exists:
#             return Response({'detail': 'Comment Already Added'}, status=status.HTTP_400_BAD_REQUEST)

#         # Check if the comment message is more than 50 characters
#         if len(comment_message) > 50:
#             return Response({'detail': 'Comment cannot be more than 50 characters'}, status=status.HTTP_400_BAD_REQUEST)


#         # Filter profanity in the comment message
#         if profanity.contains_profanity(comment_message):
#             censored_text = profanity.censor(comment_message)
#             comment_message = censored_text
#             print(f"Profanity detected! Censored text: {censored_text}")

#         comment = Comment.objects.create(
#             user=user,
#             post=post,
#             message=comment_message
#         )

#         notice = Notice.objects.create(
#             user=post.user,
#             message=f"{user.username} Added A comment Under your Post",
#             notification_type='comment',
#         )

#         return Response({'detail': 'Comment Saved'}, status=status.HTTP_201_CREATED)

# from itertools import chain

# from itertools import chain
# from rest_framework.response import Response
# from rest_framework.views import APIView
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.pagination import PageNumberPagination
# from django.utils.timezone import now

# class GetFeedView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         print(f"User agent: {request.user_agent}")

#         # Check if user.is_tutorial is False
#         if not user.is_tutorial:
#             user_agent = str(request.user_agent)
#             is_mobile_app = 'okhttp' in user_agent
#             print(f"Is Mobile App: {is_mobile_app}")

#             # If the request is from a mobile application, mark is_tutorial as True
#             if is_mobile_app:
#                 user.is_tutorial = True
#                 user.save()
#                 print("User tutorial status set to True")

#         following = user.following.all()

#         notices = Notice.objects.filter(user=user, is_read=True)
#         notices.delete()

#         if not following:
#             return Response({"detail": "You are not following anyone yet."})

#         qs = Post.objects.filter(user__in=following.values('following'))
#         vs = Post.objects.filter(user__in=following.values('following'), isSlice=True).order_by('-created_date')

#         fs = Post.objects.filter(user=user, isSlice=False)

#         qs = qs.exclude(albums__isnull=True).order_by('-created_date')
#         fs = fs.exclude(albums__isnull=False)

#         fs.delete()

#         combined_qs = list(chain(qs, vs))

#         combined_qs = sorted(combined_qs, key=lambda x: x.created_date, reverse=True)

#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10  # Set the number of posts per page
#         result_page = paginator.paginate_queryset(combined_qs, request)

#         serializer = PostSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)


# class getMyBookMarks(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         bookmarks = Bookmark.objects.filter(booker=user)

#         if not bookmarks:
#             return Response({"message": "You have not bookmarked any posts yet."})

#         bookmarked_posts = [bookmark.post for bookmark in bookmarks]

#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10 # Set the number of posts per page
#         result_page = paginator.paginate_queryset(bookmarked_posts, request)

#         serializer = PostSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)


# class GetCommentsView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, pk):
#         user = get_object_or_404(Userr, id=pk)

#         # Check if the requesting user is among the followers of the target user
#         followers = user.followers.all()
#         is_following = followers.filter(custom_id=request.user.id).exists()

#         # Your existing logic to check if the user is following and retrieve comments
#         if user.isPrivate and not is_following:
#             return Response({"detail": "This account is private."}, status=status.HTTP_403_FORBIDDEN)

#         qs = Comment.objects.filter(user=user).all()

#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10  # Set the number of comments per page
#         result_page = paginator.paginate_queryset(qs, request)

#         serializer = CommentSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)





# class getLikes(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request, pk):
#         user = get_object_or_404(Userr, id=pk)

#         # Check if the requesting user is among the followers of the target user
#         followers = user.followers.all()
#         is_following = followers.filter(custom_id=request.user.id).exists()

#         # Your existing logic to check if the user is following and retrieve likes
#         if user.isPrivate and not is_following:
#             return Response({"detail": "This account is private."}, status=status.HTTP_403_FORBIDDEN)

#         likes = Like.objects.filter(liker=user)

#         if not likes:
#             return Response({"message": "No Liked Posts"})

#         liked_posts = [like.post for like in likes if not (like.post.user.isPrivate and not followers.filter(custom_id=request.user.id).exists())]

#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10  # Set the number of liked posts per page
#         result_page = paginator.paginate_queryset(liked_posts, request)

#         serializer = PostSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)



# from rest_framework import generics


# class GetAlbumView(generics.RetrieveAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = UserSerializer
#     queryset = CustomUser.objects.all()

#     def get(self, request, *args, **kwargs):
#         # Get the target user
#         user = self.get_object()

#         # Check if the requesting user is among the followers of the target user
#         followers = user.followers.all()
#         is_following = followers.filter(custom_id=request.user.id).exists()

#         print("Followers:", [follower.custom_id for follower in followers])

#         # Check if the target user's account is private and not being followed
#         if user.isPrivate and not is_following:
#             return Response({"detail": "This account is private."}, status=status.HTTP_403_FORBIDDEN)

#         # Your existing logic to retrieve and return data

#         qs = Post.objects.filter(user=user)
#         vs = Post.objects.filter(user=user, isSlice=True).order_by('-created_date')
#         fs = Post.objects.filter(user=user, isSlice=False)

#         qs = qs.exclude(albums__isnull=True).order_by('-created_date')
#         fs = fs.exclude(albums__isnull=False)
#         fs.delete()

#         combined_qs = list(chain(qs, vs))
#         combined_qs = sorted(combined_qs, key=lambda x: x.created_date, reverse=True)



#         # Use Django REST framework's built-in pagination
#         paginator = PageNumberPagination()
#         paginator.page_size = 10  # Set the number of posts per page
#         result_page = paginator.paginate_queryset(combined_qs, request)

#         serializer = PostSerializer(result_page, many=True)
#         return paginator.get_paginated_response(serializer.data)

# @permission_classes([IsAuthenticated])
# class createPost(APIView):
#     def post(self, request):
#         user = request.user
#         data = request.data
#         post = Post.objects.create(
#             user=user,
#             caption = '',
#             description = '',
#         )
#         serializer = PostSerializer(post, many=False)
#         return Response(serializer.data)

# class updatePost(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self, request, pk):
#         post = Post.objects.get(id=pk)

#         # Check if the current user is the owner of the post
#         if request.user != post.user:
#             return Response({"detail": "Unauthorized"}, status=401)

#         data = request.data
#         post.caption = data.get('caption', post.caption)
#         post.description = data.get('description', post.description)
#         post.save()

#         serializer = PostSerializer(post, many=False)
#         return Response(serializer.data)






from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from rest_framework.decorators import permission_classes

from rest_framework import generics
from ..serializers import *
from rest_framework import status
from django.shortcuts import get_object_or_404


import logging
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)


from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from django.core.exceptions import ValidationError
from django.db import transaction



from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.db import transaction


logger = logging.getLogger(__name__)

class UploadVideo(APIView):
    parser_classes = (MultiPartParser, FormParser)

    @transaction.atomic
    def post(self, request):
        try:
            data = request.data

            post_id = data.get('post_id')
            post = Post.objects.get(id=post_id)

            vid = request.FILES.get('video')
            if vid is None:
                raise ValidationError("No video file provided")

            self.validate_video_size(vid)

            # Upload the video to Supabase
            video_url = upload_file_to_supabase(vid, BUCKET_NAME, f"videos/{vid.name}")

            # Update the post with the uploaded video URL
            post.video = video_url
            # Set isSlice to True
            post.isSlice = True
            post.save()

            # Create a Video object to store the video URL
            Video.objects.create(post=post, video=video_url)

            return Response({'detail': 'Video was uploaded successfully'})
        except ValidationError as e:
            error_message = "Validation Error: " + str(e)
            logger.error(f'Error uploading video: {error_message}')
            print(error_message)  # Print error to console
            return Response({'detail': error_message}, status=400)
        except Exception as e:
            error_message = "Internal Server Error: " + str(e)
            logger.error(f'Error uploading video: {error_message}')
            print(error_message)  # Print error to console
            return Response({'detail': error_message}, status=500)

    def validate_video_size(self, file):
        max_size = 419430400  # Maximum size in bytes (400 MB)
        if file.size > max_size:
            raise ValidationError("Maximum size for video is 400 MB")


from base.utils import upload_file_to_supabase
import logging


logger = logging.getLogger(__name__)
class UploadAlbum(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        try:
            data = request.data

            post_id = data.get('post_id')
            post = Post.objects.get(id=post_id)

            # Assuming the files are sent as 'albums' field in the request
            albums = request.FILES.getlist('albums')

            # Set the first image as the post's main image
            if albums:
                # main_image_url = upload_file_to_supabase(albums[0], BUCKET_NAME, f"images/{albums[0].name}")
                post.save()

            for album in albums:
                album_url = upload_file_to_supabase(album, BUCKET_NAME, f"images/{album.name}")
                post.image = album_url
                post.save()
                PostImage.objects.create(post=post, album=album_url)

            return Response({'detail': 'Images were uploaded successfully'})
        except Exception as e:
            logger.error(f'Error uploading images: {str(e)}')
            return Response({'detail': 'Internal Server Error'}, status=500)







class deleteComment(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        comment = get_object_or_404(Comment, id=pk)

        # Check if the user is either the author of the comment or the owner of the post
        if request.user == comment.user or request.user == comment.post.user:
            comment.delete()
            return Response("The Comment Was Deleted Successfully")
        else:
            return Response("You are not allowed to delete this comment", status=403)



class deletePost(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        post = get_object_or_404(Post, id=pk)

        # Check if the user is either the author of the post or the owner of the post
        if request.user == post.user :
            post.delete()
            return Response("The Post Was Deleted Successfully")
        else:
            return Response("You are not allowed to delete this post", status=403)


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination


class GetPostsView(APIView):
    def get(self, request):
        # Retrieve posts excluding posts from private accounts
        qs = Post.objects.filter(
            user__isPrivate=False,  # Exclude posts from private accounts
        )

        qs = qs.exclude(albums__isnull=True)

        name = request.query_params.get('name')
        if name is not None:
            qs = qs.filter(caption__icontains=name)

        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(qs, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)





class GetSlicesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        following = user.following.all()
        # Retrieve posts where isSlice is True

        if not following:
            return Response({"detail": "You are not following anyone yet."})


        vs = Post.objects.filter(user__in=following.values('following'), isSlice=True).order_by('-created_date')


        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(vs, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class GetPost(APIView):
    def get(self, request, pk):
        post = Post.objects.get(id=pk)
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)

from notifications.models import *


@permission_classes([IsAuthenticated])
class LikePost(APIView):
    def post(self, request, pk):
        liker = request.user
        post = Post.objects.get(id=pk)

        # 1. If Follower already exists
        already_exists = Like.objects.filter(liker=liker, post=post).exists()

        if already_exists:
            # If Follower already exists, delete it (unfollow)
            Like.objects.filter(liker=liker, post=post).delete()
            return Response('Like Removed')

        else:
            # If Follower doesn't exist, create it (follow)
            like = Like.objects.create(
                liker=liker,
                post=post,
            )
            o_message=f"{liker.username} liked your Post",
            o_user = post.user.id,
            o_type = 'like',


            notice = Notice.objects.create(
                user=post.user,
                message=o_message,
                notification_type=o_type
            )

            # Fetch the Expo push token for the user
            try:
                expo_token = ExpoPushToken.objects.get(user=post.user).token
                send_push_notification(expo_token, message={
                    'title': 'like',
                    'body': f"{liker.username} liked your Post",
                })
            except ExpoPushToken.DoesNotExist:
                pass  # Handle the case where the token does not exist

            return Response('Post Liked')




@permission_classes([IsAuthenticated])
class BookmarkPost(APIView):
    def post(self, request, pk):
        booker = request.user
        post = Post.objects.get(id=pk)

        # 1. If Follower already exists
        already_exists = Bookmark.objects.filter(booker=booker, post=post).exists()

        if already_exists:
            # If Follower already exists, delete it (unfollow)
            Bookmark.objects.filter(booker=booker, post=post).delete()
            return Response('Bookmark Removed')

        else:
            # If Follower doesn't exist, create it (follow)
            bookmark = Bookmark.objects.create(
                booker=booker,
                post=post,
            )
            return Response('Post Bookmarked')

from rest_framework.exceptions import ValidationError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from better_profanity import profanity


class createComment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        post = get_object_or_404(Post, id=pk)

        # Check if the post owner is private and the commenting user is a follower
        post_owner = post.user
        followers = post_owner.followers.all()
        is_follower = followers.filter(custom_id=user.id).exists()

        if post_owner.isPrivate and not is_follower:
            return Response({'detail': 'You are not allowed to comment on this post.'}, status=status.HTTP_403_FORBIDDEN)

        data = request.data
        comment_message = data.get('message', '')

        # Check if the comment already exists
        already_exists = Comment.objects.filter(user=user, post=post).exists()

        if already_exists:
            return Response({'detail': 'Comment Already Added'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the comment message is more than 50 characters
        if len(comment_message) > 50:
            return Response({'detail': 'Comment cannot be more than 50 characters'}, status=status.HTTP_400_BAD_REQUEST)


        # Filter profanity in the comment message
        if profanity.contains_profanity(comment_message):
            censored_text = profanity.censor(comment_message)
            comment_message = censored_text
            print(f"Profanity detected! Censored text: {censored_text}")

        comment = Comment.objects.create(
            user=user,
            post=post,
            message=comment_message
        )
        o_message=f"{user.username} Added A comment Under your Post",
        o_user = post.user.id,
        o_type = 'comment',

        notice = Notice.objects.create(
            user=post.user,
            message=o_message,
            notification_type=o_type
        )


        # Fetch the Expo push token for the user
        try:
            expo_token = ExpoPushToken.objects.get(user=post.user).token
            send_push_notification(expo_token, message={
                'title': 'comment',
                'body': f"{user.username} Added A comment Under your Post",
            })
        except ExpoPushToken.DoesNotExist:
            pass  # Handle the case where the token does not exist


        return Response({'detail': 'Comment Saved'}, status=status.HTTP_201_CREATED)

from itertools import chain

class GetFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        following = user.following.all()

        notices = Notice.objects.filter(user=user, is_read=True )
        notices.delete()

        if not following:
            return Response({"detail": "You are not following anyone yet."})

        qs = Post.objects.filter(user__in=following.values('following'))
        vs = Post.objects.filter(user__in=following.values('following'), isSlice=True).order_by('-created_date')

        fs = Post.objects.filter(user=user, isSlice=False)


        qs = qs.exclude(albums__isnull=True).order_by('-created_date')
        fs = fs.exclude(albums__isnull=False)

        fs.delete()



        combined_qs = list(chain(qs, vs))

        combined_qs = sorted(combined_qs, key=lambda x: x.created_date, reverse=True)



        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(combined_qs, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



class getMyBookMarks(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        bookmarks = Bookmark.objects.filter(booker=user)

        if not bookmarks:
            return Response({"message": "You have not bookmarked any posts yet."})

        bookmarked_posts = [bookmark.post for bookmark in bookmarks]

        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10 # Set the number of posts per page
        result_page = paginator.paginate_queryset(bookmarked_posts, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


class GetCommentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(Userr, id=pk)

        # Check if the requesting user is among the followers of the target user
        followers = user.followers.all()
        is_following = followers.filter(custom_id=request.user.id).exists()

        # Your existing logic to check if the user is following and retrieve comments
        if user.isPrivate and not is_following:
            return Response({"detail": "This account is private."}, status=status.HTTP_403_FORBIDDEN)

        qs = Comment.objects.filter(user=user).all()

        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of comments per page
        result_page = paginator.paginate_queryset(qs, request)

        serializer = CommentSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)





class getLikes(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(Userr, id=pk)

        # Check if the requesting user is among the followers of the target user
        followers = user.followers.all()
        is_following = followers.filter(custom_id=request.user.id).exists()

        # Your existing logic to check if the user is following and retrieve likes
        if user.isPrivate and not is_following:
            return Response({"detail": "This account is private."}, status=status.HTTP_403_FORBIDDEN)

        likes = Like.objects.filter(liker=user)

        if not likes:
            return Response({"message": "No Liked Posts"})

        liked_posts = [like.post for like in likes if not (like.post.user.isPrivate and not followers.filter(custom_id=request.user.id).exists())]

        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of liked posts per page
        result_page = paginator.paginate_queryset(liked_posts, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)



from rest_framework import generics


class GetAlbumView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    queryset = CustomUser.objects.all()

    def get(self, request, *args, **kwargs):
        # Get the target user
        user = self.get_object()

        # Check if the requesting user is among the followers of the target user
        followers = user.followers.all()
        is_following = followers.filter(custom_id=request.user.id).exists()

        print("Followers:", [follower.custom_id for follower in followers])

        # Check if the target user's account is private and not being followed
        if user.isPrivate and not is_following:
            return Response({"detail": "This account is private."}, status=status.HTTP_403_FORBIDDEN)

        # Your existing logic to retrieve and return data

        qs = Post.objects.filter(user=user)
        vs = Post.objects.filter(user=user, isSlice=True).order_by('-created_date')
        fs = Post.objects.filter(user=user, isSlice=False)

        qs = qs.exclude(albums__isnull=True).order_by('-created_date')
        fs = fs.exclude(albums__isnull=False)
        fs.delete()

        combined_qs = list(chain(qs, vs))
        combined_qs = sorted(combined_qs, key=lambda x: x.created_date, reverse=True)



        # Use Django REST framework's built-in pagination
        paginator = PageNumberPagination()
        paginator.page_size = 10  # Set the number of posts per page
        result_page = paginator.paginate_queryset(combined_qs, request)

        serializer = PostSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)

@permission_classes([IsAuthenticated])


class createPost(APIView):
    def post(self, request):
        user = request.user
        data = request.data
        post = Post.objects.create(
            user=user,
            caption = '',
            description = '',
        )
        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)




class updatePost(APIView):
    def put(self, request, pk):
        post = Post.objects.get(id=pk)
        data = request.data
        post.caption = data['caption']
        post.description = data['description']
        post.save()


        serializer = PostSerializer(post, many=False)
        return Response(serializer.data)
