# Use the official Python image.
FROM python:3.8-slim

# Set the working directory in the container.
WORKDIR /app

# Copy the requirements file into the container.
COPY requirements.txt .

# Install any dependencies.
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container.
COPY . .

# Set environment variables.
ENV PYTHONUNBUFFERED=1

# Collect static files.
RUN python manage.py collectstatic --noinput

# Run the application.
CMD ["gunicorn", "--bind", "0.0.0.0:8080", "backend.wsgi"]
