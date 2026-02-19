from flask import Flask, request, jsonify, send_from_directory, session, redirect, render_template, url_for
import mysql.connector
from flask_cors import CORS
import os, time
from werkzeug.utils import secure_filename

app = Flask(__name__)

# ---------- Sessions & Secret Key ----------
app.secret_key = "supersecretkey"   # change in production

# ---------- CORS (allow Angular frontend) ----------
CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": ["http://localhost:4200", "http://localhost:4201"]}}  # 👈 Angular default port
)

# ---------- Uploads ----------
UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"pdf", "docx", "txt"}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ---------- DB ----------
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="notes_user",         # change if needed
        password="ankur5529",      # change if needed
        database="notes_app"
    )

def allowed_file(filename):
    return (
        bool(filename)
        and '.' in filename
        and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
    )

# ---------------- AUTH ----------------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True) or {}
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not all([name, email, password]):
        return jsonify({"error": "name, email, password required"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
            (name, email, password)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Signup successful"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"success": False, "message": "email and password required"}), 400

    try:
        conn = get_db()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT * FROM users WHERE email = %s AND password = %s",
            (email, password)
        )
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            session['user_id'] = user["id"]
            return jsonify({
                "success": True, 
                "message": "Login successful",
                "user": {
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"]
                }
            }), 200
        else:
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out"}), 200

# ---------------- NOTES ----------------
@app.route('/upload_note', methods=['POST'])
def upload_note():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 403

    user_id = session['user_id']
    title = request.form.get("title")
    description = request.form.get("description", "")
    file = request.files.get("file")

    if not title or not file:
        return jsonify({"error": "title and file are required"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "File type not allowed"}), 400

    filename = f"{int(time.time())}_{secure_filename(file.filename)}"
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(filepath)
    except Exception as e:
        return jsonify({"error": f"Failed to save file: {e}"}), 500

    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO notes (user_id, title, description, file_path) VALUES (%s, %s, %s, %s)",
            (user_id, title, description, filename)
        )
        conn.commit()
        cursor.close()
        conn.close()
    except Exception as e:
        if os.path.exists(filepath):
            os.remove(filepath)
        return jsonify({"error": f"DB error: {e}"}), 500

    return jsonify({"message": "Note uploaded successfully!"}), 201


@app.route('/get_notes', methods=['GET'])
def get_notes():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 403

    user_id = session['user_id']
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM notes WHERE user_id = %s ORDER BY uploaded_at DESC", (user_id,))
    notes = cursor.fetchall()
    cursor.close()
    conn.close()

    base = request.url_root.rstrip('/')
    for n in notes:
        n["file_url"] = f"{base}{url_for('view_note', note_id=n['id'])}"
    return jsonify(notes), 200


@app.route('/view_note/<int:note_id>', methods=['GET'])
def view_note(note_id):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT file_path FROM notes WHERE id=%s", (note_id,))
    row = cursor.fetchone()
    cursor.close()
    conn.close()

    if not row:
        return jsonify({"error": "Note not found"}), 404

    filename = row[0]
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=False)


@app.route('/delete_note/<int:note_id>', methods=['DELETE'])
def delete_note(note_id):
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 403

    user_id = session['user_id']
    conn = get_db()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT user_id, file_path FROM notes WHERE id=%s", (note_id,))
    row = cursor.fetchone()

    if not row:
        cursor.close(); conn.close()
        return jsonify({"error": "Note not found"}), 404
    if str(row["user_id"]) != str(user_id):
        cursor.close(); conn.close()
        return jsonify({"error": "Not authorized"}), 403

    cursor.execute("DELETE FROM notes WHERE id=%s", (note_id,))
    conn.commit()
    cursor.close()
    conn.close()

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], row["file_path"])
    if os.path.exists(file_path):
        os.remove(file_path)

    return jsonify({"message": "Note deleted successfully"}), 200


if __name__ == "__main__":
    app.run(debug=True)
