'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const PORT = process.env.PORT || 5000;

const config = {
    channelSecret: process.env.SECRET_KEY,
    channelAccessToken: process.env.ACCESS_TOKEN
};

const app = express();

app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); //ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);

    //ここのif分はdeveloper consoleの"接続確認"用なので削除して問題ないです。
    if(req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff'){
        res.send('Hello LINE BOT!(POST)');
        console.log('疎通確認用');
        return; 
    }

    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    console.log('not text');
    return Promise.resolve(null);
  }
  
  console.log('replayMessage');
  const message = {
    "type": "template",
    "altText": "this is a carousel template",
    "template": {
        "type": "carousel",
        "columns": [
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
              "imageBackgroundColor": "#FFFFFF",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/123"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&itemid=111"
                  },
                  {
                      "type": "postback",
                      "label": "Add to cart",
                      "data": "action=add&itemid=111"
                  },
                  {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/111"
                  }
              ]
            },
            {
              "thumbnailImageUrl": "https://example.com/bot/images/item2.jpg",
              "imageBackgroundColor": "#000000",
              "title": "this is menu",
              "text": "description",
              "defaultAction": {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "http://example.com/page/222"
              },
              "actions": [
                  {
                      "type": "postback",
                      "label": "Buy",
                      "data": "action=buy&itemid=222"
                  },
                  {
                      "type": "postback",
                      "label": "Add to cart",
                      "data": "action=add&itemid=222"
                  },
                  {
                      "type": "uri",
                      "label": "View detail",
                      "uri": "http://example.com/page/222"
                  }
              ]
            }
        ],
        "imageAspectRatio": "rectangle",
        "imageSize": "cover"
    }
  } 
//  return client.replyMessage(event.replyToken, {
//    type: 'text',
//    text: event.message.text //実際に返信の言葉を入れる箇所
//  }
  return client.replyMessage(evnet.replyToken, message)
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);
