const express = require('express');
const config = require('./config');
const dbInterface = require('./db');

const router = express.Router();

/**
 * GET: /wishlist?pageSize=10&page=1
 * Fetch wishlist from db (pagination is optional)
 */
router.get('/wishlist', (req, res) => {
  authenticate()
    .then(() => {
      const pageSize = parseInt(req.query.pageSize, 10);
      const page = parseInt(req.query.page, 10);
      // find all items wishlist collection
      dbInterface.findAll(config.COLLECTION_NAME.WISHLIST, {})
        .then((docs) => {
          if (Number.isInteger(pageSize) && Number.isInteger(page)) {
            res.send({
              total: docs.length,
              data: docs.slice(pageSize * (page - 1), pageSize * page),
            });
          } else {
            // return all data
            res.send({
              total: docs.length,
              data: docs.slice(0),
            });
          }
        }).catch((err) => {
          res.status(400).json({ msg: err });
        });
    })
    .catch(() => {
      res.sendStatus(401);
    })
});

/**
 * POST: /wishlist
 * Add item to wishlist
 */
router.post('/wishlist', (req, res) => {
  authenticate()
    .then(() => {
      const { item } = req.body;
      // validate payload
      if (!item) {
        return res.status(400).json({ msg: "Wrong data" });
      }
      // insert a new item into wishlist
      dbInterface.insertOne(config.COLLECTION_NAME.WISHLIST, item)
        .then(() => {
          res.sendStatus(200);
        }).catch((err) => {
          res.status(400).json({ msg: err });
        });
    })
    .catch(() => {
      res.sendStatus(401);
    })
});

/**
 * PUT: /wishlist/data
 * update wishlist date
 */
router.put('/wishlist', (req, res) => {
  authenticate()
    .then(() => {
      // find the data from collection
      const { item } = req.body;
      dbInterface.findOneAndUpdate(
        config.COLLECTION_NAME.WISHLIST,
        { id: item.id },
        { $set: item })
        .then(() => {
          res.json({ msg: 'updated' });
        }).catch((err) => {
          res.status(400).json({ msg: err });
        });
    })
    .catch(() => {
      res.sendStatus(401);
    })
});


/**
 * DELETE: /wishlist
 * update wishlist date
 */
router.delete('/wishlist', (req, res) => {
  authenticate()
    .then(() => {
      const { item } = req.body;
      if (!item) {
        return res.sendStatus(400);
      }
      // find the data from collection
      dbInterface.findOneAndDelete(
        config.COLLECTION_NAME.WISHLIST,
        { id: item.id })
        .then(() => {
          res.json({ msg: 'deleted' });
        }).catch((err) => {
          res.status(400).json({ msg: err });
        });
    })
    .catch(() => {
      res.sendStatus(401);
    })
});

/**
 * GET: /healthCheck
 * Basic server health check
 */
router.get('/healthCheck', (req, res) => {
  res.send('OK');
});

/**
 * authenticate(): Check if logged in and has the right permission
 * return user Identity
 */
function authenticate(req) {
  // console.log('Signed Cookies: ', req.signedCookies);
  return new Promise((resolve, reject) => {
    // demo: always return resolve
    resolve();
    // if (cookies.xxxxxxx) {
    //
    // } else {
    //   reject({ msg: 'please login' })
    // }
  });
}

module.exports = router;
