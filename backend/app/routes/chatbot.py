from flask import Blueprint, request, jsonify
from app.services.chatbot_service import get_chatbot_reply

chatbot_bp = Blueprint("chatbot", __name__)


@chatbot_bp.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "service": "AI Chatbot Backend"
    })


@chatbot_bp.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    message = data.get("message", "")

    reply = get_chatbot_reply(message)

    return jsonify({
        "reply": reply
    })