let tap = require('../src/metap.js');

/**
  @param {Object} httpRequest
  @param {Object} httpResponse
  req url -> http://server_addr:port/tap/menu/submit?name=sepdsdsad
*/
function getTapMenu(req,res) {
  res.type("text/xml");
  res.send(tap.tapMenu(req.query.name));
}

/**
  @param {Object} httpRequest
  @param {Object} httpResponse
  starts TAP process
  req url http://server_addr:port/tap/phone/start?name=sepdsdsadsd&pattern=2222
*/
function doPhoneTap(req,res) {
  res.type("text/xml");
  tap.doPhoneTap(req.query.pattern, (result)=>{
    res.send(result);
  })
}

/**
  @param {Object} httpRequest
  @param {Object} httpResponse
  continue TAP process
  req url http://server_addr:port/tap/phone/continue?name=sepdsdsadsd&fakename=sep2dsdwe2
*/
function continueTap(req,res) {
  tap.continueTap(req.query.fakename, req.query.name, (result)=> {
    res.send(result);
  });
}

exports.getTapMenu = getTapMenu;
exports.doPhoneTap = doPhoneTap;
exports.continueTap = continueTap;
