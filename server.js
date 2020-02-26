const express = require('express');
const line = require('@line/bot-sdk');
const messagejson = require('./message.json');

const PORT = process.env.PORT || 5000;

const config = {
  channelSecret: process.env.SECRET_KEY,
  channelAccessToken: process.env.ACCESS_TOKEN,
};
const client = new line.Client(config);
const app = express();

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

const handleEvent = (event) => {
  let message;

  switch (event.type) {
    case 'message': {
      switch (event.message.type) {
        case 'text': {
          switch (event.message.text) {
            case '迷惑メールモードSTART': {
              switch (getRandomInt(2)) {
                case 0: {
                  message = messagejson.trueMail;
                  break;
                }
                default: {
                  message = messagejson.falseMail;
                }
              }
              break;
            }
            case 'Q-TECNO QUEST START': {
              message = messagejson.maintenance;
              break;
            }
            case 'GIVE UP': {
              message = messagejson.maintenance;
              break;
            }
            case 'HELP': {
              message = messagejson.maintenance;
              break;
            }
            default: {
              message = messagejson.error.wrongText;
            }
          }
          break;
        }
        default: {
          message = messagejson.error.wrongMessageType;
        }
      }
      break;
    }

    case 'postback': {
      switch (event.postback.data) {
        case 'trueMailOpen': {
          message = messagejson.postback.trueMail.open;
          break;
        }
        case 'trueMailNotOpen': {
          message = messagejson.postback.trueMail.notOpen;
          break;
        }
        case 'trueMailDelete': {
          message = messagejson.postback.trueMail.delete;
          break;
        }
        case 'falseMailOpen': {
          message = messagejson.postback.falseMail.open;
          break;
        }
        case 'falseMailNotOpen': {
          message = messagejson.postback.falseMail.notOpen;
          break;
        }
        case 'falseMailDelete': {
          message = messagejson.postback.falseMail.delete;
          break;
        }
        default: {
          message = messagejson.error.wrongPostback;
        }
      }
      break;
    }

    default: {
      message = messagejson.error.notEvent;
    }
  }
  console.log(message);
  return client.replyMessage(event.replyToken, message);
};


app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); // ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);
  
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});

app.listen(PORT);
console.log(`Server running at ${PORT}`);
