const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

var authenticate = require('../authenticate');

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the leader to you12!');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.end('Deleting all leader');
});


leaderRouter.route('/:leaderId')
.get((req,res,next) => {
  res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leader/'+ req.params.leaderId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
  res.write('Updating the dish: ' + req.params.leaderId + '\n');
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
  res.end('Deleting dish1: ' + req.params.leaderId);
});



module.exports = leaderRouter;
