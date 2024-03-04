const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

var authenticate = require('../authenticate');

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Will send all the promotion to you12!');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotion');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    res.end('Deleting all promotion');
});


promoRouter.route('/:promoId')
.get((req,res,next) => {
  res.end('Will send details of the promotion: ' + req.params.promoId +' to you!');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotion/'+ req.params.promoId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
  res.write('Updating the dish: ' + req.params.promoId + '\n');
  res.end('Will update the dish: ' + req.body.name + 
        ' with details: ' + req.body.description);
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next) => {
  res.end('Deleting dish1: ' + req.params.promoId);
});



module.exports = promoRouter;
