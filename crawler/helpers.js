const request = require('request');
const fs = require('fs');

const getId = ($el, regex) => $el.attr('href').match(regex)[0];
const getTitleId = ($el) => getId($el, /tt[0-9]+/);
const getNameId = ($el) => getId($el, /nm[0-9]+/);

const req = (url, fun) => request(url, (error, response) => {
  if (error) throw new Error(error);
  fun(response);
});

const writeFile = (json, filename) => {
  fs.writeFile(filename, JSON.stringify(json), (error) => {
    if (error) return console.log(error);
    console.log(`Data successfully written to ${filename}`);
  });
}

const readJsonFile = (filename) => JSON.parse(fs.readFileSync(filename, 'utf8'));

const createFile = (filename, fn) => {
  console.log(`Starting work on ${filename}`);
  if(!fs.existsSync(filename)) {
    try {
      fn(filename);
    } catch(e) {
      console.log(`Could not write to ${filename}; probably previous files have not been generated yet.`)
    }
  } else {
    console.log(`${filename} already exists`);
  }
}

module.exports = { getTitleId, getNameId, req, writeFile, readJsonFile, createFile};
