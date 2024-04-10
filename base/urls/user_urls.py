from django.urls import path
from ..views.user_views import *


urlpatterns = [

    path('getotp/', Createotp.as_view(), name='create-otp'),
    path('verify/', VerifyUserEmail.as_view(), name='verify'),
    path('upload/', uploadImage.as_view(), name='image-upload'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterUser.as_view(), name='register'),
    path('verify-email/', VerifyUserEmail.as_view(), name='verify'),
    path('google/', GoogleOauthSignInview.as_view(), name='google'),
    path('github/', GithubOauthSignInView.as_view(), name='github'),
    path('profile/', GetUserProfile.as_view(), name='user-profile'),
    path('requests/', FollowRequestsList.as_view(), name='requests'),
    path('delete/', deleteAccount.as_view(), name='delete'),
    path('profile/update/', UpdateUserProfile.as_view(), name='user-profile-update'),
    path('', GetUsersView.as_view(), name='users'),
    path('password-reset/', PasswordResetRequestView.as_view(), name='password-reset'),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordResetConfirm.as_view(), name='reset-password-confirm'),
    path('set-new-password/', SetNewPasswordView.as_view(), name='set-new-password'),
    path('<str:pk>/follow/', Follow.as_view(), name='follow'),
    path('<str:pk>/', GetUserById.as_view(), name='user'),
    path('update/<str:pk>/', UpdateUser.as_view(), name='user-update'),
    path('delete/<str:pk>/', deleteUser.as_view(), name='user-delete'),
    path('request/<str:pk>/', FollowRequestAction.as_view(), name='acept-follower'),

]
