from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from urllib import quote_plus as urlquote
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_migrate import Migrate
try:
    from local_settings import *
except ImportError:
    from production_settings import *

app = Flask(__name__)
app.secret_key = '12345'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = True
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///app.db"
db = SQLAlchemy(app)
#Migrate won't work well on sqlite better to use mysql db
migrate = Migrate(app, db)


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True,autoincrement=True)
    event_description = db.Column(db.String(50))
    date_time = db.Column(db.DateTime())
    place = db.Column(db.String(50))
    def __init__(self, event_description=None,date=None,time=None,place=None):
        self.event_description = event_description
        self.date = date
        self.time = time
        self.place = place


class MyModelView(ModelView):
    def __init__(self, model, session, name=None, category=None, endpoint=None, url=None, **kwargs):
        for k, v in kwargs.iteritems():
            setattr(self, k, v)

        super(MyModelView, self).__init__(model, session, name=name, category=category, endpoint=endpoint, url=url)


admin = Admin(app, name='rasa-site-bot', template_mode='bootstrap3')
admin.add_view(MyModelView(Event, db.session))
