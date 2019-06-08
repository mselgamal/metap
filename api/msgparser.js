
function error(result) {
    let msg = result['soapenv:Envelope']["soapenv:Body"][0]["soapenv:Fault"][0];
    return msg.faultstring[0] + " " + msg.detail[0].axlError[0].request[0];
}

function parseResult(result) {
  if (result.code === 401) {
      throw new Error("401 Authentication Failure");
  } else if (result.code === 503) {
    throw new Error("503 Service Unavailable");
  } else if (result.code !== 200) {
    throw new Error(error(result.result));
  }
  return result.result['soapenv:Envelope']["soapenv:Body"][0];
}

module.exports.parseResult = parseResult;
