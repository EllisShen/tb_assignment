const path = require('path');
// express.js and middlewares
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
// Configuration Settings
const config = require('./config');
// local modules
const api = require('./api');
// customize Mongodb interface
const dbInterface = require('./db');
// expressjs init
const app = express();

function middlewareInit() {
  // use helmet but disable frameguard
  app.use(helmet({ frameguard: false }));
  // set dist/static directory serve as static files
  if (process.env.NODE_ENV === 'production') {
    app.use('/static', express.static(path.join(__dirname, '../dist/static')));
  }
  // config bodyParser
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
  // need cookieParser middleware before we can do anything with cookies
  app.use(cookieParser('tb_secret'));
  // requests to /api/* will be sent to api router mini app
  app.use('/api', api);
}

// middleware initialize
middlewareInit();

/**
 * GET: handle '/'
 *
 */
// for production, static files should be served by nginx
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});


/**
 * server start entrypoint
 * Connect to db and listen to port
 */
dbInterface.connect()
  .then(dbInterface.initDefault)
  .then(() => {
    console.log('database initialized ...');
    // start express.js listening
    app.listen(config.LISTEN_PORT, () => {
      console.log('listening on port', config.LISTEN_PORT + ' ...');
    });
  })
  .catch((err) => { console.log(err) });
