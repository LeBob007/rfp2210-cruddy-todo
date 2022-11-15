const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, counterString) => {
    if (err) {
      throw ('Error getting ID');
    } else {
      fs.writeFile((`${exports.dataDir}` + '/' + `${counterString}` + '.txt'), text, () => {
        callback(null, { id: counterString, text });
      });
    }
  });
};

exports.readAll = (callback) => {
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);

  fs.readdir(`${exports.dataDir}`, (err, files) => {
    if (err) {
      throw ('Error reading directory!');
    } else {
      var files = _.map(files, (file) => {
        var id = file.slice(0, 5);
        var text;
        fs.readFile(`${exports.dataDir}` + '/' + `${id}` + '.txt', (err, data) => {
          if (err) {
            throw err;
          } else {
            text = data;
          }
        });
        return { id, text: id };
      });
      callback(null, files);
    }
  });
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }

  fs.readFile((`${exports.dataDir}` + '/' + `${id}` + '.txt'), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: data.toString() });
    }
  });
};

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }

  fs.readFile((`${exports.dataDir}` + '/' + `${id}` + '.txt'), (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile((`${exports.dataDir}` + '/' + `${id}` + '.txt'), text, (err, data) => {
        if (err) {
          callback(new Error(`Error writing to file with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }

  fs.unlink((`${exports.dataDir}/${id}.txt`), (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
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
