var express = require('express');
var router = express.Router();

/* GET users listing. */
router.all('/:code', function(req, res, next) {
  res.sendStatus(req.params.code);
  //res.send('respond with a resource');
});

module.exports = router;
