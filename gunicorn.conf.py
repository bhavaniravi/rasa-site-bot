# If application.py
gunicorn --bind=0.0.0.0 --timeout 600 --chdir website application:app

# If app.py
gunicorn --bind=0.0.0.0 --timeout 600 --chdir website app:app
