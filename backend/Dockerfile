# ============================================
# Lap AI — Backend Dockerfile
# Flask + Gunicorn, production-ready
# ============================================

FROM python:3.12-slim AS base

# Prevents Python from buffering stdout/stderr — critical for real-time
# log visibility in Docker/Kubernetes/CloudWatch
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install system dependencies needed for common Python packages
# (build-essential covers anything that needs compiling, e.g. future ML libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy only requirements first — this is the key Docker layer-caching trick.
# As long as requirements.txt doesn't change, this layer is reused on rebuild,
# so you don't reinstall every package every time you edit app.py.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the actual application code
COPY . .

# Run as a non-root user — standard security practice, and required
# by many Kubernetes pod security policies (including EKS defaults)
RUN useradd --create-home --shell /bin/bash appuser \
    && chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

# Healthcheck hits your actual /api/health endpoint —
# Docker and Kubernetes both use this to know the container is alive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/api/health || exit 1

# Production: Gunicorn with 2 workers is a sane default for a small
# Flask app behind EKS/Kubernetes (which will handle horizontal scaling
# at the pod level, so you don't need many workers per container)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "60", "wsgi:app"]