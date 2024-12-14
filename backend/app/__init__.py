from flask import Flask
from flask_cors import CORS
from .routes import data_routes, merged_data_routes,fetched_data_routes

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Register blueprints
    app.register_blueprint(data_routes.api_routes, url_prefix="/api")
    app.register_blueprint(merged_data_routes.merged_data_routes, url_prefix="/api")
    app.register_blueprint(fetched_data_routes.fetched_data_routes, url_prefix="/api")

    return app
