import random
from django.core.management.base import BaseCommand
from faker import Faker
from base.models import Comment, Like, Bookmark, Post, CustomUser

fake = Faker()

class Command(BaseCommand):
    help = 'Generate comments, likes, and bookmarks for existing posts and users'

    def handle(self, *args, **kwargs):
        posts = Post.objects.all()
        users = CustomUser.objects.all()

        if not posts.exists() or not users.exists():
            self.stdout.write(self.style.ERROR('No posts or users found in the database.'))
            return

        for post in posts:
            self.generate_comments(post, users)
            self.generate_likes(post, users)
            self.generate_bookmarks(post, users)

        self.stdout.write(self.style.SUCCESS('Data generation completed successfully.'))

    def generate_comments(self, post, users):
        num_comments = random.randint(30, 120)
        for _ in range(num_comments):
            user = random.choice(users)
            message = fake.text()
            Comment.objects.create(user=user, post=post, message=message)

    def generate_likes(self, post, users):
        num_likes = random.randint(10, 500)
        for _ in range(num_likes):
            user = random.choice(users)
            Like.objects.create(liker=user, post=post)

    def generate_bookmarks(self, post, users):
        num_bookmarks = random.randint(5, 120)
        for _ in range(num_bookmarks):
            user = random.choice(users)
            Bookmark.objects.create(booker=user, post=post)
