const fs = require('fs')
const file = './db/record.txt';

const recordEntry = (number, code) => {

  let newContents = "number   code  attempt\n";

  const contents = fs.readFileSync(file, 'utf8');

  const line = contents.split("\n");

    for (let i = 1 ; i < line.length ; i++) {

      if (line[i] !== "") {
        const entry = line[i].split(" ");

        if (entry[0] != number) {
          newContents = newContents + line[i] + "\n";
        }
      }
    }

  newContents = newContents + `${number} ${code} 0` + "\n";

  fs.unlinkSync(file);
  
  fs.writeFileSync(file, `${newContents}`);
}

const checkCode = (number, code) => {

  const contents = fs.readFileSync(file, 'utf8');
  
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

  fs.unlinkSync(file);
  
  fs.writeFileSync(file, `${newContents}`);

  return valid;
}

const readAttempt = (number) => {

  const contents = fs.readFileSync(file, 'utf8');
  
  const line = contents.split("\n");

  for (let i = 1 ; i < line.length ; i++) {
    
    if (line[i] !== "") {

      const entry = line[i].split(" ");

      if (entry[0] == number) {
        return entry[2];
      }
    }
  }

}

module.exports = { checkCode, recordEntry, readAttempt };