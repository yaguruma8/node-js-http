'use strict';
const http = require('http');
const server = http
    .createServer((req, res) => {
        const now = new Date();
        console.info(`[${now}] Request by ${req.socket.remoteAddress}`);
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
        });

        switch (req.method) {
            case 'GET':
                const fs = require('fs');
                const rs = fs.createReadStream('./form.html');
                rs.pipe(res);
                // res.write(`GET: ${req.url}`);
                break;
            case 'POST':
                // res.write(`POST: ${req.url}`);
                let rawData = '';
                req.on('data', (chunk) => {
                    rawData += chunk;
                }).on('end', () => {
                    const decoded = decodeURIComponent(rawData);
                    console.info(`[${now}] Data posted: ${decoded}`);
                    res.write(
                        `<html><body>${decoded}が投稿されました</body></html>`
                    );
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
