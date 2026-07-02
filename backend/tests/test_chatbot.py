from app import create_app


def test_health_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json["status"] == "healthy"


def test_chat_endpoint():
    app = create_app()
    client = app.test_client()

    response = client.post(
        "/api/chat",
        json={"message": "Hello"}
    )

    assert response.status_code == 200
    assert "reply" in response.json