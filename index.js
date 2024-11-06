// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.use((req,res,next) => {
  console.log(`${req.ip} ${req.path} ${req.method}`)
  next()
})
app.get("/api/:date?", function(req, res) {
  let DateTime;

  if (!req.params.date?.length) {
    DateTime = new Date(); 
  } else { // if exists length
    const numReg = /^\d+$/
    if ( numReg.test(req.params.date) )
      DateTime = new Date(parseInt(req.params.date))
    else {
      console.log(`parse ${req.params.date}`)
      const dateString = req.params.date
      DateTime = new Date(dateString);
    } 
  } // endif
  //
  console.log(DateTime)
  if (DateTime.toString() === "Invalid Date") {
    return res.json({ error: "Invalid date" });
  }
  //
  res.json({
    unix: DateTime.getTime(),
    utc: DateTime.toUTCString(),
  });
})

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

