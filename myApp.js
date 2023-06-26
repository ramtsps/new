const hostname = '127.85.0.1';
const port = 7787;

const express = require('express');
const app = express();
let mongodb = require('mongodb');

let db = null;
let dbConnection = "mongodb+srv://root:root@cluster0.23ebmpr.mongodb.net/nameList?retryWrites=true&w=majority";
const MongoClient = mongodb.MongoClient;

MongoClient.connect(dbConnection, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  }

  db = client.db();


  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


function pass(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="newApp"');
    res.status(401).send('Unauthorized');
    return;
  }

  const encodedCredentials = authHeader.replace('Basic ', '');
  const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
  const [username, password] = decodedCredentials.split(':');

  if (username === 'id' && password === 'pass') {
    next();
  } else {
    res.set('WWW-Authenticate', 'Basic realm="newApp"');
    res.status(401).send('Unauthorized');
  }
}

function chek(req,res,next){
  res.set('www-Authenticate','Basic realm="newApp"')
  if(req.headers.authorization == "Basic aWQ6cGFzcw=="){
    next()
  }
  else{
    res.status(401).send("no page ")
  }
  }

app.get('/', pass,(req, res) => {
  db.collection('user').find().toArray((err, result) => {
    if (err) {
      throw err;
    }
    res.send(`
    <form action="/add" method="post">
      <label for="">Enter Your name</label>
      <input type="text" name="name">
      <button>Submit</button>
    </form>
    <ol type="1">
      ${result.map((value) => `
        <li class="upvalue" >User Name: ${value.userName}</li>
        <button data-id="${value._id}" class="edit">Edit</button>
        <button data-id="${value._id}" class="delete">Delete</button>
      `).join('')}
    </ol>            
    <script src="https://unpkg.com/axios@1.1.2/dist/axios.min.js"></script>
    <script src="/brows.js"></script>
  `);
  })

});

app.post('/add', (req, res) => {
  db.collection('user').insertOne({ userName: req.body.name }, () => {
    res.redirect('/');
  });

});

app.post('/edit', (req, res) => {
  const userId = req.body.id;
  const newName = req.body.userName;

  db.collection('user').findOneAndUpdate(
    { _id: new mongodb.ObjectId(userId) },
    { $set: { userName: newName } },
    (err, result) => {
      if (err) {
        throw err;
      }
      res.send(`Data valueis updated: ${newName}`);
    }
    );
    });
    
    app.post('/delete', (req, res) => {
    const userId = req.body.id;
    
    db.collection('user').deleteOne({ _id: new mongodb.ObjectId(userId) }, (err, result) => {
    if (err) {
    throw err;
    }
    res.send(`Data with ID ${userId} is deleted`);
    });
    });
