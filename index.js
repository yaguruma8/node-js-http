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
        if (req.url === '/') {
          res.write(pug.renderFile('./pug/index.pug'));
        } else if (req.url === '/enquetes') {
          res.write(pug.renderFile('./pug/enquetes.pug'));
        } else if (req.url === '/enquetes/yaki-shabu') {
          res.write(
            pug.renderFile('./pug/form.pug', {
              path: req.url,
              firstItem: '焼肉',
              secondItem: 'しゃぶしゃぶ',
            })
          );
        } else if (req.url === '/enquetes/rice-bread') {
          res.write(
            pug.renderFile('./pug/form.pug', {
              path: req.url,
              firstItem: 'ごはん',
              secondItem: 'パン',
            })
          );
        } else if (req.url === '/enquetes/sushi-pizza') {
          res.write(
            pug.renderFile('./pug/form.pug', {
              path: req.url,
              firstItem: '寿司',
              secondItem: 'ピザ',
            })
          );
        }
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
            console.info(`[${now}] ${body}`);
            // res.write(`<html><body>${body}</body></html>`);
            res.write(
              pug.renderFile('./pug/result.pug', {
                result: body,
              })
            );
            res.end();
          });
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
