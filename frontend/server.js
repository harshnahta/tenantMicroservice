require('dotenv').config();
const { createServer } = require('http');
const { parse } = require('url');

const next = require('next');
const port = process.env.PORT || 3001;
const hostname = process.env.HOSTNAME || 'localhost';
const dev = false;
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true);

    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    // eslint-disable-next-line no-console
    console.log(`> Ready on http://localhost:${port}`);
    if (err) throw err;
  });
});
