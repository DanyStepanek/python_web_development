import sqlite3
import os

connection = sqlite3.connect('database.db')


with open('schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()


cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('First Post', 'Content for the first post')
            )

cur.execute("INSERT INTO posts (title, content) VALUES (?, ?)",
            ('Second Post', 'Content for the second post')
            )

cur.execute("INSERT INTO users (name, nick) VALUES (?, ?)",
            ('Daniel Stepanek', 'danny')
           )

cur.execute("INSERT INTO users (name, nick) VALUES (?, ?)",
            ('Valda Cvalda', 'AV ja')
           )


for path in os.listdir('static/images/gallery'):
    cur.execute("INSERT INTO images (title) VALUES (?)",
                (path,) )

connection.commit()
connection.close()
