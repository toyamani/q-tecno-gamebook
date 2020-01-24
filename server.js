const express = require('express');
const line = require('@line/bot-sdk');
const message = require('./message.json');

const PORT = process.env.PORT || 5000;

const config = {
  channelSecret: process.env.SECRET_KEY,
  channelAccessToken: process.env.ACCESS_TOKEN,
};
const client = new line.Client(config);
const app = express();


function handleEvent(event) {
  if (event.type === 'message' && event.message.type === 'text') {
    console.log('replayMessage');
    return client.replyMessage(event.replyToken, message);
  }
  if (event.type === 'postback') {
    const message1 = {
      type: 'text',
      text: 'Hello, world',
    };
    return client.replyMessage(event.replyToken, message1);
  }
  return Promise.resolve(null);
}


app.get('/', (req, res) => res.send('Hello LINE BOT!(GET)')); // ブラウザ確認用(無くても問題ない)
app.post('/webhook', line.middleware(config), (req, res) => {
  console.log(req.body.events);

  // ここのif分はdeveloper consoleの'接続確認'用なので削除して問題ないです。
  if (req.body.events[0].replyToken === '00000000000000000000000000000000' && req.body.events[1].replyToken === 'ffffffffffffffffffffffffffffffff') {
    res.send('Hello LINE BOT!(POST)');
    console.log('疎通確認用');
    return;
  }

  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
});


app.listen(PORT);
console.log(`Server running at ${PORT}`);
