def get_chatbot_reply(message):

    if not message:
        return "Please enter your message."

    message = message.lower()

    if "hello" in message:
        return "Hello! Welcome to Lap AI."

    if "hi" in message:
        return "Hi! How can I help you today?"

    if "bye" in message:
        return "Goodbye! Have a wonderful day."

    return "I'm still learning. AWS Lex integration will make me smarter soon!"