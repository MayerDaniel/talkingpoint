import flask
from flask_cors import CORS
import time
import pandas as pd
from flask import Flask, jsonify, request, render_template
import json
import os, sys
import pprint
import re
import collections
import traceback

app = Flask(__name__)
CORS(app)


users = pd.DataFrame(columns=['Name', 'Password', 'Understanding','Friendly','Interesting','Responsive', 'Thumbs'])
users.loc[0] = ['user1', 'user1', 2, 5, 5, 7, 50]
users.loc[1] = ['user2', 'user2', 3, 8, 4, 1, 31]

chat = pd.DataFrame(columns=['User','Message', 'Time', 'Thumb', 'Rebut', 'Link', 'Url'])
chat.loc[0] = ['TALKINGPOINTS', 'You are now talking with your partner about how to best raise Clementine as a daughter.\nHave fun!', time.time(), 0, '', 0, '']

@app.route('/chat',methods=['GET','POST'])
def chat_log():
    global chat
    if request.method == 'POST':
        message = request.get_json()
        print(message)
        try:
            new_row = pd.DataFrame([[message['User'],message['Message'],message['Time'], 0, '', 0, '']], columns=['User','Message', 'Time', 'Thumb', 'Rebut', 'Link', 'Url'])
            chat = chat.append(new_row, ignore_index=True)
            print(chat)
            response = {
                'status_code': 200,
                'message': "Success!\nChat is successfully logged to the backend database",
                'chat': chat.to_dict(orient='index')
            }
        except:
            response = {
                'status_code': 500,
                'message': "ERROR!\nFeedback is not successfully passed to the backend!",
                'chat': chat.to_dict(orient='index')
            }
    else:
        response = {
            'status_code': 200,
            'message': "Current chat",
            'chat': chat.to_dict(orient='index')
        }

    return jsonify(response)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/chatroom/<user>')
def chat_room(user=None):
    return render_template('chat.html')

@app.route('/login', methods=['POST'])
def authenticate():
    req = request.get_json()
    try:
        user_row = users.loc[users['Name'] == req['user']]
        response = {
            'status_code': 401.1,
            'message': "Login failed, user or password is wrong",
        }
        for i, r in user_row.iterrows():
            if r['Password'] == req['password']:
                response = {
                    'status_code': 200,
                    'message': "Authenticated",
                    'endpoint': r['Name']
                }

    except:
        print(traceback.format_exc())
        response = {
            'status_code': 500,
            'message': "Error",
        }
    return jsonify(response)


@app.route('/link', methods=['POST'])
def link():
    req = request.get_json()
    global chat
    print(req)
    try:
        # chat_row = chat.iloc[int(req['index'])]
        # print(chat_row)
        # chat_row['Link'] = 1
        chat.at[int(req['index']), 'Link'] = 1
        print(chat)
        response = {
            'status_code': 200,
            'message': 'logged'
        }

    except:
        print(traceback.format_exc())
        response = {
            'status_code': 500,
            'message': "Error",
        }
    return jsonify(response)

@app.route('/thumb', methods=['POST'])
def thumb():
    req = request.get_json()
    global chat
    print(req)
    try:
        # chat_row = chat.iloc[int(req['index'])]
        # print(chat_row)
        # chat_row['Link'] = 1
        chat.at[int(req['index']), 'Thumb'] = 1
        print(chat)
        response = {
            'status_code': 200,
            'message': 'logged'
        }

    except:
        print(traceback.format_exc())
        response = {
            'status_code': 500,
            'message': "Error",
        }
    return jsonify(response)


@app.route('/linkset', methods=['POST'])
def linkset():
    req = request.get_json()
    global chat
    print(req)
    try:
        chat.at[int(req['index']), 'Link'] = 0
        chat.at[int(req['index']), 'Url'] = req['url']
        print(chat)
        response = {
            'status_code': 200,
            'message': 'logged'
        }

    except:
        print(traceback.format_exc())
        response = {
            'status_code': 500,
            'message': "Error",
        }
    return jsonify(response)


@app.route('/rebuttalset', methods=['POST'])
def rebuttalset():
    req = request.get_json()
    global chat
    print(req)
    try:
        chat.at[int(req['index']), 'Rebut'] = req['rebuttal']
        print(chat)
        response = {
            'status_code': 200,
            'message': 'logged'
        }

    except:
        print(traceback.format_exc())
        response = {
            'status_code': 500,
            'message': "Error",
        }
    return jsonify(response)



app.run(port=3000, debug=True)
