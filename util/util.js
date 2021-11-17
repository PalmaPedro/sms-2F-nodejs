const fs = require('fs').promises
const path = require('path')

const writeToFile = code => {
  let file = '.txt';
  file = file.split('.').join(Date.now() + '.');

  fs.writeFile(`./db/${file}`, code, err => {
    if (err) throw err;
    console.log(`file ${file} saved to db`)
  });
}

const readAllFiles = async (foldername, code) => {
  let files = [];
  const items =  await fs.readdir(foldername,  { withFileTypes: true});
  //console.log(items)
    for (const item of items) {
      if (item.isDirectory()) {
        files = files.concat(readAllFiles(path.join(foldername, item.name))); 
      } else { 
        if (path.extname(item.name) === '.txt') {
          files.push(path.join(foldername, item.name))
        }
      }
    }
  return validateCode(files, code);
}

// check if code is valid 
const validateCode = async (files, code) => {
  let codesArr = [];
  for(let file of files) {
    const codeInDB = await fs.readFile(file, 'utf8');
    //console.log(codeInDB);
    codesArr.push(codeInDB);
  }
  return codesArr.includes(code) ? true : false
}
  

module.exports = { writeToFile, readAllFiles };

