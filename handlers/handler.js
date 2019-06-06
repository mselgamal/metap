let tap = require('../src/metap.js');

/*
  req url -> http://server_addr:port/tap/menu/submit?name=sepdsdsad
*/
function getTapMenu(req,res) {
  res.type("text/xml");
  res.send(tap.tapMenu(req.query.name));
}

function doPhoneTap(req,res) {
  res.type("text/xml");
  tap.doPhoneTap(req.query.name, req.query.pattern, (result)=>{
    console.log(result);
    res.send(result);
  })
}

function continueTap(req,res) {
  res.send("continueTap");
}

exports.getTapMenu = getTapMenu;
exports.doPhoneTap = doPhoneTap;
exports.continueTap = continueTap;
