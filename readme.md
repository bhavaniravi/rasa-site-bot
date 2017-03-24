# Site bot
A site bot build using [rasa-nlu](http://rasa.ai).

## Setup
1. if you are using Ubuntu
    `pip install -r requirement.txt`

2. If you are using windows machine
    `pip install -r requirement.txt`
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

4. To train your model you can use either 'spacy' or 'mitie' algorithm. For my application I am using mitie.

    If you are using `mitie` you should download a `.dat` file from
    https://github.com/mit-nlp/MITIE/releases/download/v0.4/MITIE-models-v0.2.tar.bz2

    `python -m rasa_nlu.train -c config_mitie.json`

    The training may take sometime

5. Once the training is done you will have a `models` folder created with a timestamp

6. Now you have to host this model for your bot application to use

    `python -m rasa_nlu.server -c config_mitie.json --server_model_dirs=./model_YYYYMMDD-HHMMSS`

7. To setup the knowledge base for the bot run `extract.py` under bot_applications

    `python extract.py`
    You will have a sqlite `app.db` created

8. To run the application run

    `python app.py`
