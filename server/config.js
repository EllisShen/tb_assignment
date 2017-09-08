// db name for this web app
const DB_NAME = 'tb_assignment';

// default serve port
let LISTEN_PORT;
if (process.env.NODE_ENV === 'production') {
  LISTEN_PORT = 80;
} else {
  // While in developing, WebApp runs in port 3000 or 8080
  // API service will be run separately in port 4000
  LISTEN_PORT = 4000;
}

let MONGODB_ADR;
if (process.env.DB_PORT) {
  MONGODB_ADR = `${process.env.DB_PORT.replace('tcp', 'mongodb')}/`;
} else {
  MONGODB_ADR = `mongodb://localhost:27017/`;
}

const COLLECTION_NAME = {
  WISHLIST: 'wishlist'
}

const Config = {
  LISTEN_PORT,
  MONGODB_ADR,
  DB_NAME,
  COLLECTION_NAME
};

module.exports = Config;
