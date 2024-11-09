const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const mongo = mongoose.connect(process.env.MONGODb).then(() => console.log('Connected to mongodb!'));
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const excerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date,
});
const userSchema = new Schema({
  username: String,
  excercises: [excerciseSchema]
});
const user = mongoose.model('user', userSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/api/users", (req, res) => {
  user.find().select("_id username").then((users) => {
    res.json(users);
  }).catch((err) => {
    res.status(500).json({ error: "Error fetching users", details: err });
  });
});



app.post("/api/users/:id/exercises", (req, res) => {
  const id = req.params.id;
  const desc = req.body.description
  const dur = req.body.duration
  const date = req.body.date
  const exerciseDate = date ? new Date(date) : new Date(); // default to current date if no date is provided (by chatgpt)
  
  user.findOne({ _id: id }).then((user) => {
    if (!user) {
      return res.json({ error: "User not found" });
    }
    
    user.excercises.push({
      description: desc,
      duration: dur,
      date: exerciseDate,
    });
    
    
    user.save().then(() => {
      res.json({
        username: user.username,
        description: desc,
        duration: Number(dur),
        date: exerciseDate.toDateString(),
        _id: user._id,
      });
    }).catch((err) => {
      res.status(500).json({ error: "Error saving exercise", details: err });
    });
  }).catch((err) => {
    res.status(500).json({ error: "Error finding user", details: err });
  });
});


//GET /api/users/:_id/logs?[from][&to][&limit]
// Updated GET /api/users/:_id/logs
app.get("/api/users/:id/logs", (req, res) => {
  const id = req.params.id;
  const { from, to, limit } = req.query;
  const parsedFrom = from ? new Date(from) : null;
  const parsedTo = to ? new Date(to) : null;
  const parsedLimit = limit ? parseInt(limit) : 30;

  user.findOne({ _id: id }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let exercises = user.excercises;
    // Filtering by date range if provided, by chatgpt part
    if (parsedFrom) {
      exercises = exercises.filter((ex) => new Date(ex.date) >= parsedFrom);
    }
    if (parsedTo) {
      exercises = exercises.filter((ex) => new Date(ex.date) <= parsedTo);
    }

    exercises = exercises.slice(0, parsedLimit);

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises.map((ex) => ({
        description: String(ex.description),
        duration: Number(ex.duration), 
        date: ex.date.toDateString(),  
      })),
    });
  }).catch((err) => {
    res.status(500).json({ error: "Error fetching user", details: err });
  });
});

app.post("/api/users", (req, res) => {
  console.log("api users")
  const params = req.body;
  console.log(params)
  const nUser = new user()
  nUser.username = params.username
  user.findOne({username: params.username}).then((user) => {
    if(user) {
      return  res.json({error:"User registered already"})
    }
    nUser.save().then(savedUser => {
      res.json({
        "_id": savedUser._id, 
        username: savedUser.username
      });
    })
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
