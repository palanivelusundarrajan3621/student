from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

import os

app.config['MYSQL_HOST'] = os.environ.get("MYSQLHOST")
app.config['MYSQL_USER'] = os.environ.get("MYSQLUSER")
app.config['MYSQL_PASSWORD'] = os.environ.get("MYSQLPASSWORD")
app.config['MYSQL_DB'] = os.environ.get("MYSQLDATABASE")
app.config['MYSQL_PORT'] = int(os.environ.get("MYSQLPORT", 3306))

mysql = MySQL(app)

@app.route('/')
def home():
    return render_template("index.html")


# ---------------- CREATE ----------------
@app.route('/students', methods=['POST'])
def add_student():
    try:
        data = request.json
        cur = mysql.connection.cursor()
        cur.execute("""
            INSERT INTO students(regno, name, department, year, email, phone)
            VALUES(%s,%s,%s,%s,%s,%s)
        """, (data['regno'], data['name'], data['department'],
              data['year'], data['email'], data['phone']))
        mysql.connection.commit()
        cur.close()
        return jsonify({"message": "Student Added"})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ---------------- READ ALL ----------------
@app.route('/students', methods=['GET'])
def get_students():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM students")
    rows = cur.fetchall()
    cur.close()

    students = []
    for row in rows:
        students.append({
            "id": row[0],
            "regno": row[1],
            "name": row[2],
            "department": row[3],
            "year": row[4],
            "email": row[5],
            "phone": row[6]
        })

    return jsonify(students)


# ---------------- SEARCH ----------------
@app.route('/search/<string:regno>', methods=['GET'])
def search_student(regno):
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM students WHERE regno=%s", (regno,))
    row = cur.fetchone()
    cur.close()

    if row:
        return jsonify({
            "id": row[0],
            "regno": row[1],
            "name": row[2],
            "department": row[3],
            "year": row[4],
            "email": row[5],
            "phone": row[6]
        })
    return jsonify({"message": "Student Not Found"})


# ---------------- UPDATE ----------------
@app.route('/students/<int:id>', methods=['PUT'])
def update_student(id):
    data = request.json
    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE students
        SET regno=%s, name=%s, department=%s, year=%s, email=%s, phone=%s
        WHERE id=%s
    """, (data['regno'], data['name'], data['department'],
          data['year'], data['email'], data['phone'], id))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Updated Successfully"})


# ---------------- DELETE ----------------
@app.route('/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM students WHERE id=%s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"message": "Deleted Successfully"})




if __name__ == "__main__":
    app.run()