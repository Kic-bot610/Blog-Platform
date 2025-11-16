<<<<<<< HEAD
# Blog-Platform
=======
Blog Fullstack (HTML,CSS + Flask + MySQL) - v3
==========================================

What's included:
- backend/: Flask app with JWT auth, password hashing, blog CRUD, image uploads
- frontend/: HTML,CSS (single-file component pages) with Login/Signup/Home/Profile(Create/Edit/Delete)/Create

Quick start backend:
  cd backend
  python -m venv venv
  source venv/bin/activate      # Windows: venv\Scripts\activate
  pip install -r requirements.txt
  cp .env.example .env          # edit DATABASE_URI and JWT_SECRET_KEY
  # create MySQL database 'blogdb' or change DB name in .env
  python app.py



Notes:
- The frontend expects backend at http://localhost:5000 by default.
- Uploaded images are stored in backend/uploads and served at /uploads/<filename>.
- Passwords are hashed with werkzeug. Always use HTTPS in production.
>>>>>>> de880681 (initial commit)
