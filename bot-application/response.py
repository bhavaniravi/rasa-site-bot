# dict of response for each type of intent

import datetime

response = {
    "greet": ["hey", "hello", "hi"],
    "goodbye": ["bye", "It was nice talking to you", "see you", "ttyl"],
    "affirm": ["cool", "I know you would like it"],
    "day_preference": ["which day of conference ?"],
    "time_preference": ["Do you have any time preference"],
    "events_link": [
        'You can check all the events here <a href="https://conference.pydelhi.org/#schedule_table">PyDelhi events</a>'],
    "no_events": ["No events found"],
    "intro": ["I am event bot for pydelhi, I can find you event details in minutes"],
    "default": ["Sorry I am not trained to answer that yet.", "Oops I didn't understand that sorry"]
}

mapping = {
    "now": datetime.datetime.now(),
    "tomorrow": datetime.date.today() + datetime.timedelta(days=1),
    "today": datetime.date.today(),
    "same time": datetime.datetime.now(),
    "second day": datetime.datetime.now()
}


def try_parsing_date(text):
    """
    Parses time of string format to a time object
    """
    for fmt in ('%I %p', '%I %M %p', '%I:%M %p'):
        try:
            return datetime.datetime.strptime(text, fmt)
        except ValueError:
            pass
    if ":" in text:
        return datetime.datetime.strptime(text + " " +
                                          ("AM" if int(text.split(":")[0]) >= 8 else "PM"), '%I:%M %p')
    return datetime.datetime.strptime(text + " " +
                                      ("AM" if int(text) >= 8 else "PM"), '%I %p')


def get_date_time(day, time):
    """
    Maps words like now today tom etc., to corresponding datetime objects
    """
    try:
        time = mapping[time]
    except KeyError:
        if not time:
            time = datetime.datetime.now()
        else:
            time = try_parsing_date(time)
    try:
        date = mapping[day]
    except KeyError:
        date = datetime.date.today()

    return datetime.datetime.combine(date, time.time())
