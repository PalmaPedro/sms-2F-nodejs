const fs = require('fs').promises
const file = './db/record.txt';

const recordEntry = async (number, code) => {

  const contents = await fs.readFile(file, 'utf8');
  
  const line = contents.split("\n");
  
  let newContents = "number   code  attempt\n";

  for (let i = 1 ; i < line.length ; i++) {

    if (line[i] !== "") {
      const entry = line[i].split(" ");

      if (entry[0] != number) {
        newContents = newContents + line[i] + "\n";
      }
    }
  }

  newContents = newContents + `${number} ${code} 0` + "\n";

  await fs.unlink(file);
  
  fs.writeFile(file, `${newContents}`, err => {
    if (err) throw err;
  });
}

const checkCode = async (number, code) => {

  const contents = await fs.readFile(file, 'utf8');
  
  const line = contents.split("\n");

  let valid = false;

  let newContents = "number   code  attempt\n";

  for (let i = 1 ; i < line.length ; i++) {
    
    if (line[i] !== "") {

      const entry = line[i].split(" ");

      if (entry[0] == number) {
        
        if (entry[1] == code) {
          valid = true;

        } else {
          const attempt = Number(entry[2]) + 1;
          
          if (attempt != 3) {
            newLine = entry[0] + " " + entry[1] + " " + String(attempt);
            newContents = newContents + newLine + "\n";
          }

        }

      } else {
        newContents = newContents + line[i] + "\n";
      }
    }
  }

  await fs.unlink(file);
  
  fs.writeFile(file, `${newContents}`, err => {
    if (err) throw err;
  });

  return valid;
}

module.exports = { checkCode, recordEntry };