const DefaultPort = 3000;
const ListenPort = process.env.LISTEN_PORT ? process.env.LISTEN_PORT : DefaultPort

require('dotenv').config()
const express = require('express');

const app = express();

app.get("/", function(req, res) {  
    res.sendFile(__dirname+"/serve/index.html")
});
app.use((req,res,next) => {
    console.log(`${req.ip} ${req.path} ${req.method}`)
    next()
})
app.get("/api/:date", function(req,res) {
    const DateTime = req.params.date.match(/\d+-\d+-\d+/) ? new Date(req.params.date) : new Date(parseInt(req.params.date))
    res.json({"utc": DateTime.toUTCString(),  "unix": DateTime.getTime()})
    //console.log(DateTime)
    //res.send(DateTime)
})

app.listen(ListenPort, () => {
    console.log(`Server is UP on ${ListenPort} port`)
});

module.exports = app;