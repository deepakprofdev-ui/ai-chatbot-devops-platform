"""
wsgi.py
Production entry point for Gunicorn.
Keeps app.py's dev-server block (app.run(debug=True)) separate
from the production WSGI object Gunicorn imports.
"""

from app import create_app

app = create_app()