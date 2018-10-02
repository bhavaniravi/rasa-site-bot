# Site bot
A site bot build using [rasa-nlu](http://rasa.ai).

## Setup
1. if you are using Ubuntu
    `pip install -r requirements.txt`

2. If you are using windows machine
    `pip install -r requirements.txt`
    The above command will fail for few packages like `mitie`.
    So you have to install the following
    `pip install numpy,scipy,sklearn,spacy`
    If you have error while downloading any of these packages download whl files from http://www.lfd.uci.edu/~gohlke/pythonlibs/

2. You will have two parts in this projects
    1. AI-Engine

    The AI Engine part takes care of Natural language understanding
    It is built using a open source NLU agent called rasa-nlu

    2. Bot application

    The bot application is a flask application that has a Client(Simple UI chat interface),
    a backend that fetches event details pydelhi conference website

3. Initially you need to train your bot to do that you need two json files `config` and 'training_data'.

4. To train your model you can use either 'spacy' or 'mitie' algorithm. For my application I am using `spacy`.

    If you are using `mitie` you should download a `.dat` file from
    https://github.com/mit-nlp/MITIE/releases/download/v0.4/MITIE-models-v0.2.tar.bz2
    
    If you're using spacy run the following before training
    
    ```
    python -m spacy download en_core_web_md
    python -m spacy link en_core_web_md en
    ```

5. To train your ML model run. The training will take some time.
    
   ```
   python -m rasa_nlu.train -c AI-engine/config_spacy.json --data AI-engine/data/sitebot-data.json
   ```
    
5. Once the training is done you will have a `models` folder created with a timestamp

6. Now you have to host this model for your bot application to use

    `python -m rasa_nlu.server -c AI-engine/config_spacy.json --path ./models/nlu/`

7. Now that we have the AI-Engine up and running.Let's setup the knowledge base for the bot run `extract.py` under bot_applications

    `python bot-applicaiton/extract.py`
    You will have a sqlite `app.db` created

8. To run the application run

    `python app.py`
