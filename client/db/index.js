const mongoose = require("mongoose");
try {
  var secrets = require("./secrets.js");
} catch {
  secrets = {
    mongodbUser: process.env.MONGODBUSER,
    mongodbPassword: process.env.MONGODBPASSWORD,
    mongodbCluster: process.env.MONGODBCLUSTER,
    mongodbDatabase: process.env.MONGODBDATABASE,
  };
}

const DB_URI = `mongodb+srv://${secrets.mongodbUser}:${secrets.mongodbPassword}@${secrets.mongodbCluster}/${secrets.mongodbDatabase}`;

function connect() {
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  };

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === "test") {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      const mongoServer = new MongoMemoryServer();

      mongoServer.getUri().then((mongoUri) => {
        mongoose.connect(mongoUri, mongooseOpts).then((res, err) => {
          if (err) return reject(err);
          resolve();
        });
      });
    } else {
      mongoose.connect(DB_URI, mongooseOpts).then((res, err) => {
        if (err) return reject(err);
        resolve();
      });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

module.exports = { connect, close };
