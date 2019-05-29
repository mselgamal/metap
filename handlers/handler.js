let taps = require('../src/metaps');

function getTapsMenu(req,res) {
  res.type("text/xml");
  let xml = "<CiscoIPPhoneInput><Title>Enter Extension</Title>"+
        "<URL>http://"+process.env.SERV_ADDR+":"+process.env.HTTP_PORT+
        "/etaps/submit?device="+req.query.device+"</URL>"+
        "<InputItem>"+
        "<DisplayName>Extension</DisplayName>"+
        "<QueryStringParam>ext</QueryStringParam>"+
        "<DefaultValue></DefaultValue>"+
        "<InputFlags>N</InputFlags>"+
        "</InputItem></CiscoIPPhoneInput>";
  res.send(xml);
}

function doTaps(req,res) {
  //do taps
}

function getAddAdminMenu(req,res) {
  // respond with menu page to hash authentication info
}

exports.getTapsMenu = getTapsMenu;
exports.getTapsMenu = doTaps;
