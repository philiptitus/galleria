import random
from django.core.management.base import BaseCommand
from faker import Faker
from base.models import *

class Command(BaseCommand):
    help = 'Populate the database with fake data'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Fetch the user with id 23
        user = CustomUser.objects.get(id=23)

        # Fetch all existing posts
        posts = Post.objects.all()
        if not posts:
            self.stdout.write(self.style.ERROR('No posts found in the database.'))
            return

        # Create 20 comments
        comments = []
        for _ in range(20):
            post = random.choice(posts)
            comment = Comment(
                user=user,
                message=fake.text(max_nb_chars=20),
                post=post
            )
            comments.append(comment)
        Comment.objects.bulk_create(comments)
        self.stdout.write(self.style.SUCCESS('Successfully created 20 comments.'))

        # Create 20 follow requests
        users = CustomUser.objects.exclude(id=23)
        follow_requests = []
        for _ in range(20):
            requester = random.choice(users)
            follow_request = FollowRequest(
                requester=requester,
                receiver=user,
                status='pending'
            )
            follow_requests.append(follow_request)
        FollowRequest.objects.bulk_create(follow_requests)
        self.stdout.write(self.style.SUCCESS('Successfully created 20 follow requests.'))
