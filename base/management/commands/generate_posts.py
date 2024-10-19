import os
import random
import shutil
from django.core.management.base import BaseCommand
from django.conf import settings
from base.models import Post, PostImage, CustomUser
from base.utils import upload_file_to_supabase, BUCKET_NAME
from faker import Faker
import mimetypes
from storage3.utils import StorageException

fake = Faker()

SUPPORTED_MIME_TYPES = {
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    # Add other supported MIME types here
}

class Command(BaseCommand):
    help = 'Generate posts with images from static/images folder'

    def handle(self, *args, **kwargs):
        images_dir = os.path.join(settings.BASE_DIR, 'static', 'images')
        if not os.path.exists(images_dir):
            self.stdout.write(self.style.ERROR('Images directory does not exist'))
            return

        images = [f for f in os.listdir(images_dir) if os.path.isfile(os.path.join(images_dir, f))]
        if not images:
            self.stdout.write(self.style.ERROR('No images found in the directory'))
            return

        users = list(CustomUser.objects.all())
        if not users:
            self.stdout.write(self.style.ERROR('No users found in the database'))
            return

        while images:
            # Select a random user
            user = random.choice(users)

            # Generate random caption and description
            caption = fake.sentence()
            description = fake.paragraph()

            # Create a new post
            post = Post.objects.create(
                caption=caption,
                description=description,
                user=user
            )

            # Select between 2 and 5 images for the post
            num_images = random.randint(2, 5)
            selected_images = []

            for _ in range(num_images):
                if not images:
                    break
                image_name = images.pop(0)
                image_path = os.path.join(images_dir, image_name)
                mime_type, _ = mimetypes.guess_type(image_path)
                if mime_type in SUPPORTED_MIME_TYPES:
                    selected_images.append(image_name)
                else:
                    self.stdout.write(self.style.WARNING(f'Skipping unsupported MIME type: {mime_type} for file: {image_name}'))

            for image_name in selected_images:
                image_path = os.path.join(images_dir, image_name)
                with open(image_path, 'rb') as image_file:
                    try:
                        image_url = upload_file_to_supabase(image_file, BUCKET_NAME, f"images/{image_name}")
                        PostImage.objects.create(post=post, album=image_url)
                    except StorageException as e:
                        if e.args[0].get('statusCode') == 400 and e.args[0].get('error') == 'Duplicate':
                            self.stdout.write(self.style.WARNING(f'Duplicate file detected: {image_name}. Deleting local file.'))
                            os.remove(image_path)
                            continue
                        else:
                            raise

                # Delete the image from the local folder
                os.remove(image_path)

            self.stdout.write(self.style.SUCCESS(f'Post created with caption: {caption}'))

        self.stdout.write(self.style.SUCCESS('All images processed and posts created'))
