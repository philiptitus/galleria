import requests
from django.conf import settings

GOOGLE_TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
GOOGLE_USERINFO_ENDPOINT = 'https://www.googleapis.com/oauth2/v3/userinfo'

def exchange_code_for_tokens(auth_code):
    """
    Exchanges the authorization code for access and ID tokens
    """
    data = {
        'code': auth_code,
        'client_id': settings.GOOGLE_CLIENT_ID,
        'client_secret': settings.GOOGLE_CLIENT_SECRET,
        'redirect_uri': settings.GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }

    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(GOOGLE_TOKEN_ENDPOINT, data=data, headers=headers)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching tokens: {response.status_code} - {response.text}")
        return None

def get_user_info(access_token):
    """
    Fetch user information using the access token
    """
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get(GOOGLE_USERINFO_ENDPOINT, headers=headers)

    if response.status_code == 200:
        return response.json()  # User information in JSON format
    else:
        print(f"Error fetching user info: {response.status_code} - {response.text}")
        return None