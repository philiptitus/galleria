from django.urls import path
from ..views.post_views import  *


urlpatterns = [
    path('', GetFeedView.as_view(), name='feed'),
    path('uploads/', UploadAlbum.as_view(), name='images-upload'),
    path('videos/', UploadVideo.as_view(), name='video-upload'),
    path('new/', createPost.as_view(), name='new-post'),
    path('gallery/', GetPostsView.as_view(), name='get_posts'),
    path('slices/', GetSlicesView.as_view(), name='get_slices'),
    path('bookmarks/', getMyBookMarks.as_view(), name='get_my_bookmarks'),
    path('<str:pk>/', GetPost.as_view(), name='get_post'),
    path('update/<str:pk>/', updatePost.as_view(), name='post-update'),
    path('<str:pk>/like/', LikePost.as_view(), name='like'),
    path('<str:pk>/likes/', getLikes.as_view(), name='likes'),
    path('<str:pk>/album/', GetAlbumView.as_view(), name='album'),
    path('<str:pk>/bookmark/', BookmarkPost.as_view(), name='bookmark'),
    path('<str:pk>/comment/', createComment.as_view(), name='create-comment'),
    path('comment/<str:pk>/delete/', deleteComment.as_view(), name='delete-comment'),
    path('<str:pk>/comments/', GetCommentsView.as_view(), name='my-comments'),
    path('<str:pk>/delete/', deletePost.as_view(), name='delete-post'),












]
