'use strict';
const http = require('http');
const pug = require('pug');
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info(`[${now}] Request by ${req.socket.remoteAddress}`);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
    });

    switch (req.method) {
      case 'GET':
        res.write(
          pug.renderFile('./form.pug', {
            path: req.url,
            firstItem: '焼き肉',
            secondItem: 'しゃぶしゃぶ',
          })
        );
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', (chunk) => {
            rawData += chunk;
          })
          .on('end', () => {
            const decoded = decodeURIComponent(rawData);
            console.info(`[${now}] Data posted: ${decoded}`);
            const qs = require('querystring');
            const ans = qs.parse(decoded);
            const body = `${ans['name']}さんは${ans['favorite']}に投票しました。`;
            console.info(`[${now}] ${body}`)
            res.write(`<html><body>${body}</body></html>`);
            res.end();
          });
        break;
      case 'DELETE':
        res.write(`DELETE: ${req.url}`);
        break;
      default:
        break;
    }
  })
  .on('error', (e) => {
    console.error(`[${new Date()}] Server Error`, e);
  })
  .on('clientError', (e) => {
    console.error(`[${new Date()}] Client Error`, e);
  });

const port = 8000;
server.listen(port, () => {
  console.info(`[${new Date()}] Listening on ${port}`);
});
