"""Tests for health check endpoints."""


def test_health_endpoint(client):
    """Test the /api/health endpoint returns healthy status."""
    response = client.get("/api/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "environment" in data


def test_root_health_endpoint(client):
    """Test the /health endpoint returns healthy status."""
    response = client.get("/health")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "environment" in data


def test_api_root(client):
    """Test the /api root endpoint."""
    response = client.get("/api")

    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "Learning Tracker API" in data["message"]
