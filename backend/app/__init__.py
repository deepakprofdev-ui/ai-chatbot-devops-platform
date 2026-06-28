from flask import Flask
from flask_cors import CORS
from app.routes.chatbot import chatbot_bp


def create_app():

    app = Flask(__name__)

    CORS(app)

    app.register_blueprint(chatbot_bp, url_prefix="/api")

    return app