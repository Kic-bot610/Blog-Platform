Backend (Flask) README
----------------------
1. Copy .env.example to .env and fill DATABASE_URI and JWT_SECRET_KEY.
2. Setup virtualenv and install dependencies:
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
3. Create MySQL DB (run init_db.sql or create manually as blogdb).
4. Run: python app.py  (development server)
5. API endpoints:
   POST /signup           {username,email,password}
   POST /login            {email,password} -> returns access_token
   GET /blogs             (jwt) user blogs
   GET /blogs/all         (public) all blogs
   POST /blogs            (jwt, form-data) title, body, image(file)
   PUT /blogs/<id>        (jwt) update blog
   DELETE /blogs/<id>     (jwt) delete blog
