var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('/*', function(req, res, next) {
  var resp = {};
  resp['request-headers'] = req.headers;
  resp['request-params'] = req.params;
  resp['request-body'] = req.body;
  resp['request-query'] = req.query;
  info = resp['request-info'] = {}
  info['address'] = req.ip;
  info['proxys'] = req.ips;
  info['path'] = req.originalUrl;
  info['method'] = req.method;
  info['cookie'] = req.signedCookies;
  info['protocol'] = req.protocol;
  if (info['protocol'] == 'https'){
      info['secure'] = req.secure?'tls':'ssl';
  }
  info['recv-time'] = req._startTime;
  console.log(req.ServerResponse);
  if (req.query.pretty) {
      resp = "<pre id=\'json\'>\n" + JSON.stringify(resp, null, 4) + "\n</pre>";
  }
  console.log(resp);
  res.send(resp);
});

module.exports = router;
