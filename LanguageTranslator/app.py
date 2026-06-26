from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator

app = Flask(__name__)

LANGUAGES = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt",
    "Russian": "ru",
    "Japanese": "ja",
    "Chinese (Simplified)": "zh-CN",
    "Korean": "ko",
    "Arabic": "ar",
    "Hindi": "hi"
}

@app.route("/")
def index():
    return render_template("index.html", languages=LANGUAGES)

@app.route("/translate", methods=["POST"])
def translate_text():
    data = request.get_json(force=True)
    text = data.get("q", data.get("text", "")).strip()
    target_language = data.get("target", data.get("target_language"))

    if not text:
        return jsonify({"error": "Please enter text to translate."}), 400
    if not target_language:
        return jsonify({"error": "Please select a target language."}), 400

    try:
        translated = GoogleTranslator(source="auto", target=target_language).translate(text)
        return jsonify({"translated_text": translated})
    except Exception as exc:
        return jsonify({"error": f"Translation failed: {exc}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
