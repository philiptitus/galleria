from django.core.management.base import BaseCommand
from base.models import Post, PostImage

class Command(BaseCommand):
    help = 'Update the image field of all posts with the first album image'

    def handle(self, *args, **kwargs):
        posts = Post.objects.all()

        for post in posts:
            # Get the first PostImage associated with the post
            first_post_image = post.albums.first()

            if first_post_image:
                # Set the post.image field to the album URL of the first PostImage
                post.image = first_post_image.album
                post.save()
                self.stdout.write(self.style.SUCCESS(f'Updated image for post: {post.caption}'))
            else:
                self.stdout.write(self.style.WARNING(f'No images found for post: {post.caption}'))

        self.stdout.write(self.style.SUCCESS('All posts processed and images updated'))
