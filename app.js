const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let database

(async function connect_mongo() {
    let client = await MongoClient.connect('mongodb://localhost:27017')
    database = client.db("IOT");
    // let message = await database.collection("message").find().toArray()
    // console.log(message)
    // client.close()
})()

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

//admin_lte関連の奴
app.use('/adminlte', express.static(__dirname + '/node_modules/admin-lte'));

//nodemodule転送
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//jsの
app.use('/js', express.static(__dirname + '/js'));

app.use(bodyParser.json());
app.get('/', function (req, res) {
    res.sendfile(__dirname + "/login.html");
});
app.get('/main', function (req, res) {
    res.sendfile(__dirname + "/index2.html");
});
app.get('/data/:id', async function (req, res) {
    let id = req.params.id
    let data = await database.collection("data").find({"id": id}).toArray()
    res.send(data);
});
app.post("/data", async function (req, res) {
    console.log(req.body)
    if (!("temp" in req.body) || !("id" in req.body)) {
        res.send('ダメです');
        return
    }
    let data = req.body;
    data.time = Date.now()
    database.collection("data").insertOne(data)
    res.send('OK');
})
app.listen(80);
