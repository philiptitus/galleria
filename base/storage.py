from supabase import create_client, Client
from django.core.files.storage import Storage
from django.conf import settings
import mimetypes
import logging

class SupabaseStorage(Storage):
    def __init__(self):
        # Initialize Supabase client using the URL and API key from settings
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.bucket_name = 'Galleria'  # Your bucket name here
        self.client: Client = create_client(self.url, self.key)

    def _save(self, name, content):
        # Ensure the 'name' is a string (path on Supabase)
        if not isinstance(name, str):
            raise ValueError(f"The 'name' must be a string, but got {type(name)}")

        # Guess the content type (MIME type) of the file
        content_type = mimetypes.guess_type(name)[0] or 'application/octet-stream'
        
        logging.debug(f"Uploading file with name: {name}")
        logging.debug(f"Detected content type: {content_type}")

        # Ensure the content is rewound before reading
        content.seek(0)

        # Upload the file to the Supabase bucket
        bucket = self.client.storage.from_(self.bucket_name)
        res = bucket.upload(file=content, path=name, file_options={"content-type": content_type})

        # Check the response and handle errors or return the file path
        if res.get('data'):
            logging.info(f"File uploaded successfully: {name}")
            return name
        else:
            error_msg = res.get('error')
            logging.error(f"Failed to upload to Supabase: {error_msg}")
            raise Exception(f"Failed to upload to Supabase: {error_msg}")

    def url(self, name):
        # Generate and return the public URL for a file
        bucket = self.client.storage.from_(self.bucket_name)
        public_url_res = bucket.get_public_url(name)
        return public_url_res['publicURL']

    def exists(self, name):
        # Check if the file exists in the Supabase bucket by listing files with the prefix (path)
        bucket = self.client.storage.from_(self.bucket_name)
        res = bucket.list({'prefix': name})
        return res.get('data') is not None and len(res['data']) > 0

    def delete(self, name):
        # Delete a file from the Supabase bucket
        bucket = self.client.storage.from_(self.bucket_name)
        res = bucket.remove([name])
        if res.get('data'):
            logging.info(f"File {name} deleted successfully")
        else:
            logging.error(f"Failed to delete file {name}: {res.get('error')}")
            raise Exception(f"Failed to delete file from Supabase: {res.get('error')}")
