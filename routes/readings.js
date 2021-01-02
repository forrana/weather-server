var express = require('express');
var sqlite3 = require('sqlite3').verbose()
var router = express.Router();

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the chinook database.');
});

db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS readings (temperature TEXT, humidity TEXT, created_at datetime default current_timestamp)')
})
/* GET users listing. */
router.get('/', function(req, res, next) {
  db.serialize(function () {
      let rows =  db.all('SELECT temperature, humidity, created_at FROM readings', function (err, rows) {
          res.send(rows);
      })
  })
});

router.post('/', function(req, res, next) {

  db.serialize(function () {
    const stmt = db.prepare('INSERT INTO readings VALUES (?, ?, ?)')
    const body = req.body
    stmt.run(body.temperature, body.humidity, Date.now())
    stmt.finalize()
    res.send("Done");
  })
  // db.close()
});

module.exports = router;
