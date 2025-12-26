const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
app.use(express.json());

// If form data is used (HTML form)
app.use(express.urlencoded({
  extended: true
}));

let id = 1;
let data = [];
let exercise = [];

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {
  const userName = req.body.username
  const newUser = {
    "_id": id,
    "username": userName
  }
  data.push(newUser);
  res.json({
    "username": userName,
    "_id": id
  })
  id++;
})

app.get('/api/users', (req, res) => {
  res.send(data)
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = Number(req.params._id);
  const desc = req.body.description;
  const duration = Number(req.body.duration);
  let date;
  if (!req.body.date) {
    date = new Date().toDateString();
  } else {
    date = new Date(req.body.date).toDateString();
  }

  let userObj = data.find(user =>
    user._id === id)
  console.log(userObj)
  if (!userObj) {
    return res.status(404).json({
      error: "User not found"
    })
  }

  let response = {
    "_id": id,
    "username": userObj.username,
    "date": date,
    "duration": duration,
    "description": desc,
  }
  exercise.push(response)

  res.json({
    "_id": id,
    "username": userObj.username,
    "date": date,
    "duration": duration,
    "description": desc,
  })

})

app.get("/api/users/:_id/logs", (req, res) => {

  const id = Number(req.params._id)
  const userObj = data.find(user => user._id === id)
  const userExercise = exercise.filter(e => e._id === id);

  let {
    from,
    to,
    limit
  } = req.query;

  if (from) {
    userExercise = userExercise.filter(user => new Date(user.date) >= new Date(from));
  }
  if (to) {
    userExercise = userExercise.filter(user => new Date(user.date) <= new Date(to));
  }
  if (limit) {
    userExercise = userExercise.slice(0, limit);
  }


  res.send({
    _id: userObj._id,
    username: userObj.username,
    count: userExercise.length,
    log: userExercise.map(users => ({
      description: users.description,
      duration: users.duration,
      date: users.date
    }))



  })

})





const listener = app.listen(process.env.PORT || 4000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})