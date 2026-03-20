import requests

BASE_URL = "http://localhost:8001/api/v1"

def test_register():
    print("Testing Registration...")
    try:
        data = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password123"
        }
        resp = requests.post(f"{BASE_URL}/auth/register", json=data)
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text}")
        return resp.status_code in [200, 400]
    except Exception as e:
        print(f"Error during registration: {e}")
        return False

def test_login():
    print("\nTesting Login...")
    try:
        # OAuth2PasswordRequestForm expects data, not json
        data = {
            "username": "testuser",
            "password": "password123"
        }
        resp = requests.post(f"{BASE_URL}/auth/login", data=data)
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text}")
        if resp.status_code == 200:
            return resp.json()["access_token"]
        return None
    except Exception as e:
        print(f"Error during login: {e}")
        return None

def test_generate_roadmap(token):
    print("\nTesting Roadmap Generation...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        data = {"topic": "Artificial Intelligence"}
        resp = requests.post(f"{BASE_URL}/roadmap/generate-roadmap", json=data, headers=headers)
        print(f"Status Code: {resp.status_code}")
        print(f"Response: {resp.text}")
        if resp.status_code == 200:
            return resp.json()["task_id"]
        return None
    except Exception as e:
        print(f"Error during roadmap generation: {e}")
        return None

if __name__ == "__main__":
    if test_register():
        token = test_login()
        if token:
            print(f"\nLogin Successful! Token: {token[:20]}...")
            task_id = test_generate_roadmap(token)
            if task_id:
                print(f"Task Started! ID: {task_id}")
            else:
                print("Task Initiation Failed.")
        else:
            print("\nLogin Failed.")
    else:
        print("\nRegistration Failed.")
