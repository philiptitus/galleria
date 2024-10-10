# Galleria - A Social Media Platform

Galleria is a dynamic social media platform where users can share images, videos, and posts, follow other users, and engage through comments, likes, and bookmarks. The platform is built with Django on the backend and React (with Redux) on the frontend, leveraging Django Rest Framework (DRF) for a fully RESTful API. Below you will find detailed instructions on how to install, set up, and contribute to this project.

Did you Know Galleria Has a mobile version as well check it out here [Galleria-Mobile](https://mrphilip.pythonanywhere.com/portfolio/gallleria-mobile-version-beta) 


## Table of Contents
1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [API Endpoints](#api-endpoints)
5. [Frontend](#frontend)
6. [Database](#database)
7. [Collaboration](#collaboration)
8. [Contact](#contact)

## Features

- User authentication (login, registration, Google and GitHub OAuth)
- Upload and manage photos, albums, and videos
- Like, bookmark, and comment on posts
- Follow/unfollow users and handle follow requests
- Notifications for chats and user interactions
- Password recovery and email verification
- User profile management (view and update profiles)

## Tech Stack

- **Backend**: Django, Django Rest Framework (DRF), PostgreSQL
- **Frontend**: React, Redux, JavaScript
- **API**: RESTful API with JWT authentication
- **Database**: PostgreSQL
- **Others**: OAuth (Google, GitHub)

## Installation

Follow the instructions below to set up and run the project locally.

### Backend (Django)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/philiptitus/galleria.git
   cd galleria
   ```

2. **Create and activate a virtual environment:**

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables:**

   Create a `.env` file in the project root and configure the following:

   ```bash
   SECRET_KEY=<your_secret_key>
   DATABASE_URL=<your_postgres_database_url>
   DEBUG=True
   ```

5. **Run migrations:**

   ```bash
   python manage.py migrate
   ```

6. **Create a superuser:**

   ```bash
   python manage.py createsuperuser
   ```

7. **Run the development server:**

   ```bash
   python manage.py runserver
   ```

### Frontend (React)

1. **Navigate to the frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the React development server:**

   ```bash
   npm start
   ```

4. **Access the app:**

   Visit `http://localhost:3000` to view the app.

## API Endpoints

Here is an overview of the most important API endpoints available in the Galleria platform:

### Posts

- **Get Feed**: Retrieve the feed with posts.
  ```bash
  GET /api/posts/
  ```

- **Create New Post**: Upload a new post (image, video, or text).
  ```bash
  POST /api/posts/new/
  ```

- **Like Post**: Like a post by its ID.
  ```bash
  POST /api/posts/<post_id>/like/
  ```

- **Bookmark Post**: Bookmark a post by its ID.
  ```bash
  POST /api/posts/<post_id>/bookmark/
  ```

- **Comment on Post**: Add a comment to a post by its ID.
  ```bash
  POST /api/posts/<post_id>/comment/
  ```

### User Authentication

- **Login**: Obtain a JWT token for authentication.
  ```bash
  POST /api/users/login/
  ```

- **Register**: Register a new user.
  ```bash
  POST /api/users/register/
  ```

- **Google OAuth**: Login with Google OAuth.
  ```bash
  POST /api/users/google/
  ```

- **GitHub OAuth**: Login with GitHub OAuth.
  ```bash
  POST /api/users/github/
  ```

- **Profile**: Retrieve or update user profile information.
  ```bash
  GET /api/users/profile/
  ```

### Follow/Unfollow Users

- **Follow/Unfollow**: Follow or unfollow a user by their ID.
  ```bash
  POST /api/users/<user_id>/follow/
  ```

- **Follow Requests**: Manage follow requests.
  ```bash
  GET /api/users/requests/
  ```

### Notifications

- **User Notifications**: Fetch notifications related to user activity.
  ```bash
  GET /api/notifications/
  ```

- **Chats**: View or delete chat messages with a specific user.
  ```bash
  GET /api/notifications/chats/<user_id>/
  ```

## Frontend

The frontend is a single-page application (SPA) built with React. It interacts with the Django backend via the RESTful API and manages state using Redux. Users can:

- View and upload posts
- Like, comment, and bookmark posts
- Follow/unfollow users
- Manage profiles and settings
- Get notified of activities (likes, comments, follows, chats)

The React frontend can be found in the `frontend/` directory, and the main files to look at are:

- `App.js`: Main React component
- `store/`: Redux store setup
- `components/`: Contains UI components
- `services/`: API interaction logic

## Database

The project uses **PostgreSQL** as the primary database. You'll need to configure the database URL in your `.env` file.

### Migrations

To run migrations and keep the database schema up to date, use the following commands:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Collaboration

Interested in contributing? Great! Follow these steps:

1. **Fork the repository**: Click the "Fork" button at the top right of the repository page.
2. **Create a feature branch**: Develop your feature or fix in a new branch.
   ```bash
   git checkout -b feature-branch
   ```
3. **Commit your changes**: Make sure to include descriptive commit messages.
   ```bash
   git commit -m "Add new feature"
   ```
4. **Push your branch**:
   ```bash
   git push origin feature-branch
   ```
5. **Submit a pull request**: Open a pull request to the `main` branch of the repository.

### Code Style

- Follow [PEP 8](https://pep8.org/) for Python code.
- Use [ESLint](https://eslint.org/) for JavaScript linting.
- Always write clear and descriptive commit messages.

For any issues or feature requests, open an issue in the GitHub repository.

## Contact

For any questions or inquiries, feel free to reach out via the contact form on my [portfolio](https://mrphilip.pythonanywhere.com/contact/) or create an issue in the repository.

GitHub: [https://github.com/philiptitus](https://github.com/philiptitus)

---

Thank you for checking out Galleria!
