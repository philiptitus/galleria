from django.core.management.base import BaseCommand
from base.models import Comment, Like, Bookmark

class Command(BaseCommand):
    help = 'Delete all comments, likes, and bookmarks from the database'

    def handle(self, *args, **kwargs):
        # Delete all comments
        Comment.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All comments have been deleted.'))

        # Delete all likes
        Like.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All likes have been deleted.'))

        # Delete all bookmarks
        Bookmark.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('All bookmarks have been deleted.'))

        self.stdout.write(self.style.SUCCESS('Data deletion completed successfully.'))
