const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

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
  let results = [];
  fs.readdir(exports.dataDir, (err, data) => {
    if (err) {
      callback(err);
    } else {
      for (let i = 0; i < data.length; i++) {
        results.push({
          id: data[i].slice(0, 5),
          text: data[i].slice(0, 5)
        });
      }
      callback(null, results);
    }
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
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
