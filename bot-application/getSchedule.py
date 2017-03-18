class getSchedule:
    def getSchedule(schedule, tracks, table_body):
        schedule_rows = []
        for i in range(len(schedule)):
            talk_id = schedule[i]["talk_id"]
            entity_details = schedule[i]
            title = entity_details["title"]
            if "speaker" in tracks["talk_id"]:
                speaker_name= tracks["talk_id"]["speaker"]
                display_title=title+" by "+speaker_name
            else:
                display_title=title
            time_duration = entity_details["start_time"] + ' - ' + entity_details["end_time"]

            try:
                current_day_track = schedule[i]["track"]
                if current_day_track =='all':
                    schedule_rows.append([time_duration,display_title])
            except:
                schedule_rows.append([time_duration, display_title])
            if current_day_track==1:
         # else if (current_day_track == '1')
                schedule_rows.append([time_duration, display_title])
            else:
                # index_of_last_row = len(schedule_rows) - 1
                schedule_rows.append(display_title)

