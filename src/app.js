const axios = require('axios');
const { JSDOM } = require('jsdom');
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors())

const server = app.listen(3000);
const io = require('socket.io')(server);

const googleDollarSearchURL = process.env.DOLLAR_URL;

async function getData() {
  const { data } = await axios.get(googleDollarSearchURL, {
    headers: {
      referer: 'https://www.google.com/',
      pragma: 'no-cache',
      TE: 'Trailers',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7',
      'Upgrade-Insecure-Requests': 1,
      'user-agent': 'Chrome/96.0.4664.45',
    },
  });

  const dom = new JSDOM(data);
  return (
    dom.window.document
      .querySelector('.kCrYT .iBp4i')
      .textContent.split(' ')[0] + ' TL'
  );
}

async function execute(millis) {
  setInterval(async () => {
    const data = await getData();
    io.emit('dollar', data)
  }, millis)
}

io.on('connection', (socket) => {
  console.log('Client Connected');
});

execute(60000).then();
