require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

/////
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
////

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
const shorturls = []
app.get("/api/shorturl/:shorturl", (req,res)=> {
  /*const id = req.params.shorturl
  res.set('Location', shorturls[id - 1]);*/
  const id = parseInt(req.params.shorturl); 
  const url = shorturls[id - 1];
  if (url) {
    return res.redirect(url);
  } 
})
app.post("/api/shorturl", (req,res) => {
  const data = req.body;
  const url = data.url
 /* let error = false
  if  (!url) {
    error = true
  }*/
  const hostname = new URL(url).hostname;
  dns.lookup(hostname, {}, (error, address, family) => {
   /* if (err) {
      error = true
      console.log(`bad url ${hostname}`)
    } else {
      console.log(`good url ${hostname}`)
    }*/
      if (error) {
        console.log("send error")
        return res.json({ "error": 'invalid url' })
      } else {
          console.log('add domain')
          // ^^ regexp
          shorturls.push(url)
          //{ original_url : 'https://freeCodeCamp.org', short_url : 1}
          res.json({
            original_url: url, short_url: shorturls.length
          })
      }
  }) 
 
})



// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
