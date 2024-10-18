import httpx
from urllib.parse import quote
import jmespath
from typing import Dict
import json

def parse_post(data: Dict) -> Dict:
    # Extract the required fields from the post data
    result = {
        "id": data.get("id"),
        "shortcode": data.get("shortcode"),
        "poster_name": data.get("owner", {}).get("username"),
        "poster_pfp": data.get("owner", {}).get("profile_pic_url"),
        "likes_count": data.get("edge_liked_by", {}).get("count"),
        "comments_count": data.get("edge_media_to_comment", {}).get("count"),
        "comments": [
            {
                "comment_id": comment.get("node", {}).get("id"),
                "comment_text": comment.get("node", {}).get("text"),
                "commenter_name": comment.get("node", {}).get("owner", {}).get("username"),
                "commenter_pfp": comment.get("node", {}).get("owner", {}).get("profile_pic_url"),
            }
            for comment in data.get("edge_media_to_comment", {}).get("edges", [])
        ],
        "likers": [
            {
                "liker_name": liker.get("node", {}).get("username"),
                "liker_pfp": liker.get("node", {}).get("profile_pic_url"),
            }
            for liker in data.get("edge_liked_by", {}).get("edges", [])
        ],
        "media_url": data.get("display_url"),
        "media_type": "photo" if data.get("is_video") is False else "video",
    }
    return result

def scrape_user_posts(user_id: str, session: httpx.Client, page_size=10, max_pages: int = None):
    base_url = "https://www.instagram.com/graphql/query/?query_hash=e769aa130647d2354c40ea6a439bfc08&variables="
    variables = {
        "id": user_id,
        "first": page_size,
        "after": None,
    }
    _page_number = 1
    while True:
        resp = session.get(base_url + quote(json.dumps(variables)))
        data = resp.json()
        posts = data["data"]["user"]["edge_owner_to_timeline_media"]
        for post in posts["edges"]:
            yield parse_post(post["node"])  # note: we're using parse_post function from previous chapter
        page_info = posts["page_info"]
        if _page_number == 1:
            print(f"scraping total {posts['count']} posts of {user_id}")
        else:
            print(f"scraping page {_page_number}")
        if not page_info["has_next_page"]:
            break
        if variables["after"] == page_info["end_cursor"]:
            break
        variables["after"] = page_info["end_cursor"]
        _page_number += 1
        if max_pages and _page_number > max_pages:
            break

def scrape_user(username: str):
    """Scrape Instagram user's data"""
    client = httpx.Client(
        headers={
            # this is internal ID of an Instagram backend app. It doesn't change often.
            "x-ig-app-id": "936619743392459",
            # use browser-like features
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9,ru;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept": "*/*",
        }
    )
    result = client.get(
        f"https://i.instagram.com/api/v1/users/web_profile_info/?username={username}",
    )
    data = json.loads(result.content)
    return data["data"]["user"]

# Example run:
if __name__ == "__main__":
    with httpx.Client(timeout=httpx.Timeout(20.0)) as session:
        user_id = scrape_user('nairobi_gossip_club')['id']
        print(f"User ID: {user_id}")
        posts = list(scrape_user_posts(user_id, session, max_pages=3))
        print(json.dumps(posts, indent=2, ensure_ascii=False))
