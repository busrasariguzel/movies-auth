const express = require('express');
const router = express.Router();

/* GET home page. */ //home page to logout
router.get('/', function(req, res, next) {
  res.send('Welcome! You must log in to continue')
  // res.render('index', { title: 'Express' });
});

module.exports = router;