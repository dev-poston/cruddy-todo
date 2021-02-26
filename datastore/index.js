const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const FS = Promise.promisifyAll(fs);
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, data) => {
    fs.writeFile(`${exports.dataDir}/${data}.txt`, text, (error, res) => {
      if (error) {
        console.log('did not create new text file at path');
      } else {
        callback(null, { id: data, text: text });
      }
    });
  });

};

exports.readAll = (callback) => {
  return FS.readdirAsync(exports.dataDir)
    .then((files) => {
      let newArray = files.map((file) => {
        let id = file.slice(0, 5);
        return FS.readFileAsync(`${exports.dataDir}/${id}.txt`)
          .then((data) => {
            return { id: id, text: data.toString() };
          });
      });
      Promise.all(newArray)
        .then((newArray) => {
          callback(null, newArray);
        });
    })
    .catch( (error) => {
      callback(error);
    });
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (error, res) => {
    if (error) {
      console.log('no mon, no fun, yo son: no matching id');
      callback(error);
    } else {
      callback(null, { id: id, text: res.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, (error, data) => {
    if (error) {
      console.log('Do not pass go');
      callback(error);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (error, data) => {
        if (error) {
          console.log('Write file failed');
          callback(error);
        } else {
          callback(null, { id: id, text: text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err, data) => {
    if (err) {
      console.log('no dice, try again');
      callback(err);
    } else {
      callback(null, data);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
