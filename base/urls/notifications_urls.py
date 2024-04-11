from django.urls import path
from ..views.notification_views import *

urlpatterns = [
    path('chat/', Chat.as_view()),
    path('', UserNotices.as_view()),
    path('conversations/', UsersEngagedInConversation.as_view()),
    path('chats/<int:pk>/', AllMessagesWithUser.as_view()),
    path('<int:pk>/delete/', DeleteUnreadMessageView.as_view())




]