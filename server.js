const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const FormData = require('form-data')
const { checkCode, recordEntry } = require('./util/util.js')
const number = '91708509'

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'));

// login in
app.get('/', (req, res) => {
 return res.sendFile(path.join(__dirname, '/public/login.html'))
});

// Get token
app.post('/get-token', (req, res) => {
  const token = req.body.token;
  console.log(`Token from client: ${token}`);

  try {
    // verify token
    const decode = jwt.verify(token.toString(), 'jwt-secret-key');
    console.log(decode); 
  } catch(err) {
      console.log(err);
  }

  // generate 5-digit code
  const code = Math.floor(Math.random() * 90000) + 1000;
  console.log(`Generated code: ${code}\nSending as SMS...`);

  // send code to queue
  recordEntry(number, code.toString());

  // send SMS with code for validation
  const form = new FormData();
    form.append("to_phone", number)
    form.append("message", `Your verification code is: ${code}`)
    form.append("api_key", "ebd0a9bb-a1e4-46ea-ad19-2af2ea302f56") 

    form.submit('https://fatsms.com/send-sms', (err, res) => {
      if(err) throw err;
      res.resume()
    })
   
  res.status(200).json(token);
});   

// validation form
app.get('/validate', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public/validate.html'))
})

// verify code
app.post('/validate', async (req, res) => {
  const code = req.body.code;
  console.log(code)

  // check if code matches with any stored in db
  if (await checkCode(number, code)) {
    console.log('code valid')
  } else {
    console.log('wrong code, try again!') 
  } 

})

const PORT = 3000;
app.listen(PORT, () => console.log('Server started!'));


