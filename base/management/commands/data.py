import random
from ...models import Comment, CustomUser, Post
from faker import Faker

fake = Faker()

# Get the user with ID 15
user_id_15 = CustomUser.objects.get(pk=15)

# Get existing posts
existing_posts = Post.objects.all()

# Generate 50 comments
for _ in range(50):
    # Choose a random existing post
    post = random.choice(existing_posts)
    
    # Generate a fake comment message with maximum 25 characters
    message = fake.text(max_nb_chars=25)
    
    # Create the comment
    comment = Comment.objects.create(
        user=user_id_15,
        message=message,
        post=post
    )
