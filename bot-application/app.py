from flask import Flask
from flask import render_template,jsonify,request
import requests
from models import *
from response import *
import random

@app.route('/')
def hello_world():
    """
    Sample hello world
    """
    return render_template('home.html')

get_random_response = lambda intent:random.choice(response[intent])

def format_entities(entities):
    """
    formats entities to key value pairs
    """
    ## Should be formatted to handle multiple entity values
    e = {"day":None,"time":None,"place":None}
    for entity in entities:
        e[entity["entity"]] = entity["value"]
    return e

def get_event(day=None,time=None,place=None):
    """
    gets event date and time from user utterance
    and finds event within next half an hour of that range
    """
    if not day and not time:
        return get_random_response("events_link")
    date_time = get_date_time(day,time)
    print date_time
    events = Event.query.filter(Event.date_time>=date_time,
                                Event.date_time <= date_time + datetime.timedelta(minutes=30))
    events = events.all()
    if not events:
        return get_random_response("no_events")+ "<br/>" + get_random_response("events_link")
    event_description = "<br/>".join(event.event_description+" at "+event.place for event in events)
    return event_description

@app.route('/chat',methods=["POST"])
def chat():
    """
    chat end point that performs NLU using rasa.ai
    and constructs response from response.py
    """
    try:
        response = requests.get("http://localhost:5000/parse",params={"q":request.form["text"]})
        response = response.json()
        intent = response["intent"]
        entities = format_entities(response["entities"])
        if intent == "event-request":
            response_text = get_event(entities["day"],entities["time"],entities["place"])
        else:
            response_text = get_random_response(intent)
        return jsonify({"status":"success","response":response_text})
    except Exception as e:
        print e
        return jsonify({"status":"success","response":"Sorry I am not trained to do that yet..."})


app.config["DEBUG"] = True
if __name__ == "__main__":
    app.run(port=8000)
