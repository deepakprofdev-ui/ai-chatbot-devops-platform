from app import create_app

def test_app_creation():
    app = create_app()
    assert app is not None

def test_health_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200