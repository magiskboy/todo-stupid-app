const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://username:password@localhost:27017/todo'

const app = express();
const db = mongoose.connect(MONGO_URI, {useUnifiedTopology: true, useNewUrlParser: true});
app.use(bodyParser.json());

const Task = mongoose.model('Task', {
  name: String,
  status: String,
  createdAt: Date,
});


app.get('/ping', function(req, res) {
  res.status(204).send('');
});

app.get('/tasks', function(req, res) {
  let q = req.query.q || '';
  let page = parseInt(req.query.page) || 1;
  let perPage = parseInt(req.query.perPage) || 10;
  Task.find({})
    .skip((page-1) * perPage)
    .limit(perPage)
    .exec(function(error, tasks) {
      if (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
      }
      else {
        res.json({
          page: page,
          perPage: perPage,
          tasks: tasks
        });
      }
    });
});

app.get('/tasks/:taskId', function(req, res) {
  let taskId = req.params.taskId;
  if (mongoose.Types.ObjectId.isValid(taskId)) {
    Task.findById(taskId, function(error, task) {
      if (error) {
          console.log(error);
          res.status(500).json({message: 'Internal Server Error'});
      }
      else {
        if (!!task) res.json(task.toJSON());
        else res.status(404).json({message: 'Task not found'});
      }
    });
  }
  else {
    res.status(400).json({message: 'Bad Request'});
  }
});

app.post('/tasks', function(req, res) {
 let newTask = new Task(req.body);
  newTask.save(function(error, data) {
    if (error) {
      console.log(error);
      res.status(500).json({message: 'Internal Server Error'});
    }
    else {
      res.status(201).json({id: data._id});
    }
  });
});

app.put('/tasks/:taskId', function(req, res) {
  let taskId = req.params.taskId;
  Task.findByIdAndUpdate(taskId, function(error, data) {
    if (error) {
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    else {
      res.status(204).send('');
    }
  });
});

app.delete('/tasks/:taskId', function(req, res) {
  let taskId = req.params.taskId;
  Task.findByIdAndDelete(taskId, function(error, data) {
    if (error) {
      res.status(500).json({
        message: 'Internal Server Error'
      });
    }
    else {
      res.status(204).send('');
    }
  });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running ${HOST}:${PORT}`)
});
