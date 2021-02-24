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
  exports.readAll((err, data) => {
    if (err) {
      console.log('too bad, so sad, did not read one file');
      callback(err);
    } else {
      //Need to check for data[i] being undefined
      for (var i = 0; i < data.length; i++) {
        // if (!data[i]) do something
        if (id === data[i].slice(0, 5)) {
          fs.readFile(`${exports.dataDir}/${id}.txt`, (error, res) => {
            if (error) {
              console.log('no mon, no fun, yo son: no matching id');
              callback(error);
            } else {
              callback(null, res);
            }
          });
        }
      }
    }
  });




  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
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
