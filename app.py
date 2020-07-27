# https://www.patricksoftwareblog.com/steps-for-starting-a-new-flask-project-using-python3/
# http://zetcode.com/db/sqlitepythontutorial/

import sqlite3
from gen_sec_key import gen_key
from flask import Flask, render_template, request, url_for, flash, redirect
from werkzeug.exceptions import abort
from werkzeug.utils import secure_filename
import os
import base64

app = Flask(__name__)

app.config['SECRET_KEY'] = gen_key(100).decode()
app.config['IMAGE_UPLOADS'] = '/static/images/gallery'
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JPEG", "JPG", "PNG", "GIF"]
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def get_post(post_id):
    conn = get_db_connection()
    post = conn.execute('SELECT * FROM posts WHERE id = ?', (post_id,)).fetchone()

    conn.close()
    if post is None:
        abort(404)
    return post

@app.route("/")
def index():
    conn = get_db_connection()
    posts = conn.execute('SELECT * FROM posts').fetchall()
    conn.close()
    return render_template('index.html', posts=posts)

@app.route('/<int:post_id>')
def post(post_id):
    post = get_post(post_id)
    return render_template('post.html', post=post)

@app.route('/create', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']

        if not title:
            flash('Title is required!')
        else:
            conn = get_db_connection()
            conn.execute('INSERT INTO posts(title, content) VALUES (?, ?)',
                        (title, content))
            conn.commit()
            conn.close()
            return redirect(url_for('index'))

    return render_template('create.html')

@app.route('/r_p_s_game')
def r_p_s_game():
    return render_template('r_p_s_game.html')

@app.route('/<int:id>/edit', methods=('GET', 'POST'))
def edit(id):
    post = get_post(id)

    if request.method == 'POST':
        title = request.form['title']
        content = request.form['content']

        if not title:
            flash('Title is required!')
        else:
            conn = get_db_connection()
            conn.execute('UPDATE posts SET title = ?, content = ?'
                         ' WHERE id = ?',
                         (title, content, id))
            conn.commit()
            conn.close()
            return redirect(url_for('index'))

    return render_template('edit.html', post=post)

@app.route('/<int:id>/delete', methods=('POST',))
def delete(id):
    post = get_post(id)

    conn = get_db_connection()
    conn.execute('DELETE FROM posts WHERE id = ?', (id,))
    conn.commit()
    conn.close()

    flash('"{}" was succesfully deleted!'.format(post['title']))

    return redirect(url_for('index'))


@app.route('/gallery', methods=('GET', 'POST'))
def gallery():
    conn = get_db_connection()
    imgs = conn.execute('SELECT title FROM images').fetchall()

    conn.close()
    return render_template('gallery.html', images=imgs)

def allowed_image(filename):

    # We only want files with a . in the filename
    if not "." in filename:
        return False

    # Split the extension from the filename
    ext = filename.rsplit(".", 1)[1]

    # Check if the extension is in ALLOWED_IMAGE_EXTENSIONS
    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False

@app.route('/upload-image', methods=['GET', 'POST'])
def upload_image():
    if request.method == "POST":
        if request.files:
            image = request.files['image']

            if image.filename == "":
                flash("No filename")
                return redirect(request.url)
            if allowed_image(image.filename):
                filename = secure_filename(image.filename)
                image.save(os.getcwd() + os.path.join(app.config['IMAGE_UPLOADS'], filename))
                flash("image saved")

                conn = get_db_connection()
                conn.execute('INSERT INTO images(title) VALUES (?)',
                            (filename, ))
                conn.commit()
                conn.close()

            else:
                flash("Type of file is not allowed!")

            return redirect(url_for('gallery'))

    return render_template('upload_image.html')

# https://github.com/jbshep/flask-image-demo/blob/master/app.py



if __name__ == "__main__":
    app.run()
