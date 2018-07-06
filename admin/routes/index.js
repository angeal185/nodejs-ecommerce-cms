const express = require('express'),
router = express.Router(),
_ = require('lodash'),
config = require('../config'),
data = require('../data/data');


router.get('/', function(req, res) {
  res.render('index', {
    title: 'dash',
    config: config,
    data:data
  });
});

_.forEach(['items','gallery','blog'],function(i){
  router.get('/'+i, function(req, res) {
    res.render('items', {
      title: i,
      config: config,
      data:data
    })
  });
});



module.exports = router;
