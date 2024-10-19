from django.core.management.base import BaseCommand
from base.models import Post

class Command(BaseCommand):
    help = 'Delete all Post instances from the database'

    def handle(self, *args, **kwargs):
        # Get all Post instances
        posts = Post.objects.all()

        # Delete all Post instances
        posts.delete()

        self.stdout.write(self.style.SUCCESS('Successfully deleted all Post instances'))
