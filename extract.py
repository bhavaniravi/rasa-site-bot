import sqlite3
import requests
import json

conn = sqlite3.connect('app.db')
c = conn.cursor()
# print("Opened database successfully")

conn.execute('''CREATE TABLE IF NOT EXISTS Event
       (ID INT    NOT NULL   ,
       event_description VARCHAR(40),
       date_time DATATIME,
       place  VARCHAR(40));''')
# print("Table created successfully")

url = "https://conference.pydelhi.org/api/schedule.json"
r = requests.get(url)
data = r.text
schedule = json.loads(data)["0.0.1"][0]
url2 = "https://conference.pydelhi.org/api/tracks.json"
r2 = requests.get(url2)
data2 = r2.text
tracks = json.loads(data2)["0.0.1"][0]
DATE_ONE = "2017-03-18"
DATE_TWO = "2017-03-19"

schedule["2017-03-23"] = schedule[DATE_ONE]
del schedule[DATE_ONE]

schedule["2017-03-24"] = schedule[DATE_TWO]
del schedule[DATE_TWO]


DATE_ONE = "2017-03-23"
DATE_TWO = "2017-03-24"

from datetime import datetime
# DayOne Loop
for events in schedule[DATE_ONE]:
    title = events["title"]
    talk_id = str(events["talk_id"])
    start_time = events["start_time"]
    end_time = events["end_time"]
    track = events["track"]
    description = tracks[talk_id]["description"]
    theTime = datetime.strptime(DATE_ONE +
     " " + start_time+" "+("AM" if int(start_time.split(":")[0])>8 else "PM"),
     "%Y-%m-%d %I:%M %p")

    place = "AUDI 1"
    speaker = ''
    if track != "all":
        speaker = tracks[talk_id]["speaker"]["name"]
    if track == "all":
        place = "AUDI 1"
    elif track == "1":
        place = "AUDI 1"
    elif track == "2":
        place = "LECTURE HALL 1"
    else:
        place = "LECTURE HALL 2"
    if speaker != '':
        title = title + " by " + speaker
    c.execute("insert into  Event (ID,event_description,date_time,place) values(?,?,?,?)",
              (talk_id, title, theTime, place))
    conn.commit()

# Day2 Loop
for events in schedule[DATE_TWO]:
    title = events["title"]
    place = "AUDI 1"
    speaker = ''
    talk_id = str(events["talk_id"])
    start_time = events["start_time"]
    end_time = events["end_time"]
    track = events["track"]
    description = tracks[talk_id]["description"]
    if track != "all":
        speaker = tracks[talk_id]["speaker"]["name"]
    if track == "all":
        place = "AUDI 1"
    elif track == "1":
        place = "AUDI 1"
    elif track == "2":
        place = "LECTURE HALL 1"
    else:
        place = "LECTURE HALL 2"
    theTime = datetime.strptime(DATE_TWO +
     " " + start_time+" "+("AM" if int(start_time.split(":")[0])>8 else "PM"),
     "%Y-%m-%d %I:%M %p")
    if speaker != '':
        title = title + " by " + speaker
    conn.execute("insert into  Event (ID,event_description,date_time,place) values(?,?,?,?)",
                 (talk_id, title, theTime, place))
    conn.commit()

print("all data")
c.execute("select * from Event")
for i in c.fetchall():
    print(i)

conn.close()
