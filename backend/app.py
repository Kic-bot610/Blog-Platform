import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Blog
from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')
ALLOWED_EXTENSIONS = {'png','jpg','jpeg','gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in ALLOWED_EXTENSIONS

def create_app():
    app = Flask(__name__, static_folder=None)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-key')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

    CORS(app)
    db.init_app(app)
    jwt = JWTManager(app)

    @app.route('/health')
    def health():
        return jsonify({'ok': True})

    @app.route('/signup', methods=['POST'])
    def signup():
        data = request.get_json() or {}
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return jsonify({'msg':'username,email,password required'}), 400
        if User.query.filter((User.username==username)|(User.email==email)).first():
            return jsonify({'msg':'user already exists'}), 400
        hashed = generate_password_hash(password)
        user = User(username=username, email=email, password=hashed)
        db.session.add(user)
        db.session.commit()
        return jsonify({'msg':'user created'}), 201

    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json() or {}
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({'msg':'email and password required'}), 400
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password, password):
            return jsonify({'msg':'invalid credentials'}), 401
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token, 'username': user.username, 'email': user.email})

    @app.route('/blogs', methods=['GET'])
    @jwt_required()
    def get_blogs():
        user_id = get_jwt_identity()
        blogs = Blog.query.filter_by(user_id=user_id).order_by(Blog.created_at.desc()).all()
        out = []
        for b in blogs:
            out.append({'id':b.id,'title':b.title,'body':b.body,'image':b.image,'created_at':b.created_at.isoformat()})
        return jsonify(out)

    @app.route('/blogs/all', methods=['GET'])
    def get_all_blogs():
        blogs = Blog.query.order_by(Blog.created_at.desc()).all()
        out = []
        for b in blogs:
            out.append({'id':b.id,'title':b.title,'body':b.body,'image':b.image,'author':b.author.username,'created_at':b.created_at.isoformat()})
        return jsonify(out)

    @app.route('/blogs', methods=['POST'])
    @jwt_required()
    def create_blog():
        user_id = get_jwt_identity()
        title = request.form.get('title')
        body = request.form.get('body')
        image_file = request.files.get('image')
        if not title or not body:
            return jsonify({'msg':'title and body required'}), 400
        filename = None
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(save_path)
        blog = Blog(title=title, body=body, image=filename, user_id=user_id)
        db.session.add(blog)
        db.session.commit()
        return jsonify({'msg':'created','id':blog.id}), 201

    @app.route('/blogs/<int:blog_id>', methods=['PUT'])
    @jwt_required()
    def update_blog(blog_id):
        user_id = get_jwt_identity()
        blog = Blog.query.get_or_404(blog_id)
        if blog.user_id != user_id:
            return jsonify({'msg':'forbidden'}), 403
        data = request.get_json() or {}
        title = data.get('title')
        body = data.get('body')
        if title: blog.title = title
        if body: blog.body = body
        db.session.commit()
        return jsonify({'msg':'updated'})

    @app.route('/blogs/<int:blog_id>', methods=['DELETE'])
    @jwt_required()
    def delete_blog(blog_id):
        user_id = get_jwt_identity()
        blog = Blog.query.get_or_404(blog_id)
        if blog.user_id != user_id:
            return jsonify({'msg':'forbidden'}), 403
        db.session.delete(blog)
        db.session.commit()
        return jsonify({'msg':'deleted'})

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000)
