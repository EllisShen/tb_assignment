const MongoClient = require('mongodb').MongoClient;
const config = require('./config');
const errInterface = require('./error');
const mockData = require('../mock/mock_products.json');

let db;  // global mongodb interface

/**
 * connect to mongodb
 * call initDefault() when success
 */
function connect() {
  return new Promise((resolve, reject) => {
    MongoClient.connect(config.MONGODB_ADR + config.DB_NAME)
      .then((database) => {
        db = database;
        resolve();
      }, (err) => {
        reject(err);
      });
  });
}

/**
 * findOne(name, query):
 * find one document from collection
 */
function findOne(collectName, query) {
  return new Promise((resolve, reject) => {
    const collection = db.collection(collectName);
    // Find all
    collection.findOne(query).then((doc) => {
      resolve(doc);
    }, (err) => {
      reject(err);
    });
  });
}

/**
 * findAll(name, query):
 * find all documents from collection
 */
function findAll(collectName, query) {
  return new Promise((resolve, reject) => {
    const collection = db.collection(collectName);
    // Find all
    collection.find(query).toArray((err, docs) => {
      if (err) {
        reject(err);
      }
      resolve(docs);
    });
  });
}

/**
 * insertOne(name, data):
 * insert one document into collection
 */
function insertOne(collectName, data) {
  return new Promise((resolve, reject) => {
    const collection = db.collection(collectName);
    // inset one
    collection.insertOne(data).then(() => {
      resolve();
    }, (err) => {
      reject(err);
    });
  });
}

/**
 * insertMany(name, data):
 * insert many into collection
 */
function insertMany(collectName, data) {
  return new Promise((resolve, reject) => {
    const collection = db.collection(collectName);
    // inset one
    collection.insertMany(data).then(() => {
      resolve();
    }, (err) => {
      reject(err);
    });
  });
}


/**
 * findOneAndUpdate(name, query, data):
 * find one from collection and update it, upsert one if document is not exist
 */
function findOneAndUpdate(collectName, filter, update) {
  return new Promise((resolve, reject) => {
    const collection = db.collection(collectName);
    collection.findOneAndUpdate(filter, update, {
      upsert: true,
      returnNewDocument: true,
    }).then((doc) => {
      resolve(doc);
    }, (err) => {
      reject(err);
    });
  });
}


/**
 * findOneAndDelete(name, query, data):
 * find one from collection and update it, upsert one if document is not exist
 */
function findOneAndDelete(collectName, filter) {
  return new Promise((resolve, reject) => {
    const collection = db.collection(collectName);
    collection.findOneAndDelete(filter).then((doc) => {
      resolve(doc);
    }, (err) => {
      reject(err);
    });
  });
}


/**
 * the place to insert default database data
 */
function initDefault() {
  return new Promise((resolve) => {
    // init default mock data
    db.collection(config.COLLECTION_NAME.WISHLIST)
      .count()
      .then((count) => {
        if (count === 0) {
          // insert mock data
          return insertMany(config.COLLECTION_NAME.WISHLIST, mockData.products)
        }
      })
      .then(() => {
        resolve();
      })
      .catch(err => {
        errInterface.errorHandler(err);
      });
  });
}

const DBInterface = {
  connect,
  initDefault,
  findOne,
  findAll,
  insertOne,
  insertMany,
  findOneAndUpdate,
  findOneAndDelete
};

module.exports = DBInterface;
