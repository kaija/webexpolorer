var express = require('express');
var geoip = require('geoip-lite');
var router = express.Router();
var parser = require('ua-parser-js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Web Explorer' });
});

function rand_path(len)
{
var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < len; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
router.get('/ua', function(req, res, next) {
  var ua = parser(req.headers['user-agent']);
  if (req.query.pretty) {
    res.send("<pre id=\'json\'>\n" + JSON.stringify(ua, null, '  ') + "\n</pre>");
  }else{
    res.send(ua);
  }
});

router.get('/geoip', function(req, res, next) {
  var ary = req.ip.split(':');
  var ip = ary[ary.length -1];
  geo = geoip.lookup(ip);
  if (req.query.pretty) {
    res.send("<pre id=\'json\'>\n" + JSON.stringify(geo, null, '  ') + "\n</pre>");
  }else{
    res.send(geo);
  }
});

router.all('/random', function(req, res, next) {
  path = rand_path(10);
  res.redirect('/'+path);
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
  var ary = req.ip.split(':');
  var ip = ary[ary.length -1];
  geo = geoip.lookup(ip);
  if (geo) {
    resp['geo'] = geo;
    resp['google-map'] = 'https://www.google.com.tw/maps/@'+geo.ll[0]+',' +geo.ll[1]+',10z'
  }else{
    resp['geo'] = {'error': 'unavailable! maybe a private ip'};
  }
  console.log(resp);
  console.log(info['geo']);
  /* Latest convert*/
  if (req.query.pretty) {
      resp = "<pre id=\'json\'>\n" + JSON.stringify(resp, null, 4) + "\n</pre>";
  }
  res.send(resp);
});

module.exports = router;
