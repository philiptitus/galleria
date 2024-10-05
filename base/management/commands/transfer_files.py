import os
import mimetypes
from django.core.management.base import BaseCommand
from django.conf import settings
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://izpkijnmscmbolveusoo.supabase.co"  # Replace with your Supabase URL
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6cGtpam5tc2NtYm9sdmV1c29vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQzMTk3MTYsImV4cCI6MjAzOTg5NTcxNn0.1c_QYcsO5X8_Wzol4a5ua28FdM3wzzCtdcNxnsD1dJs"  # Replace with your Supabase Key
BUCKET_NAME = "Galleria"  # Replace with your bucket name

# Initialize the Supabase client
def init_supabase() -> Client:
    client = create_client(SUPABASE_URL, SUPABASE_KEY)
    return client

# Function to upload a file to Supabase bucket
def upload_file_to_supabase(file_path: str, bucket_name: str, destination_path: str):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File at {file_path} not found")

    supabase = init_supabase()

    # Get the MIME type of the file based on its extension
    mime_type, _ = mimetypes.guess_type(file_path)

    # Default to 'application/octet-stream' if the MIME type cannot be determined
    if mime_type is None:
        mime_type = 'application/octet-stream'

    # List of supported MIME types
    supported_mime_types = [
        'image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime',
        'application/pdf', 'text/plain', 'text/html', 'application/json',
        'application/zip', 'application/x-tar', 'application/x-gzip'
    ]

    if mime_type not in supported_mime_types:
        print(f"Skipping file {file_path} with unsupported MIME type {mime_type}")
        return False

    with open(file_path, 'rb') as file_data:
        bucket = supabase.storage.from_(bucket_name)
        res = bucket.upload(destination_path, file_data, file_options={"content-type": mime_type})

        # Check for successful upload by status code or data presence
        if res.status_code == 200:  # Check for success (or adjust based on response status)
            print(f"File successfully uploaded to {bucket_name}/{destination_path}")
            public_url = bucket.get_public_url(destination_path)
            print(f"Public URL of the uploaded file: {public_url}")
            return True
        else:
            print(f"Upload failed with error: {res.json()}")  # Use .json() to inspect the error
            return False

class Command(BaseCommand):
    help = 'Transfer files from MEDIA_ROOT to Supabase storage and delete the local files'

    def handle(self, *args, **kwargs):
        media_root = settings.MEDIA_ROOT
        files_to_transfer = []

        # Collect all files to transfer
        for root, _, files in os.walk(media_root):
            for file in files:
                file_path = os.path.join(root, file)
                files_to_transfer.append(file_path)

        # Transfer and delete files
        for file_path in files_to_transfer:
            destination_path = os.path.relpath(file_path, media_root)
            if upload_file_to_supabase(file_path, BUCKET_NAME, destination_path):
                os.remove(file_path)
                print(f"Deleted local file: {file_path}")

        print("File transfer and deletion process completed.")
