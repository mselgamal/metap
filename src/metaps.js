let Request = require("../api/SOAPRequest.js");
let LineOperations = require("../api/LineOperations.js");
let fs = require('fs');

function deviceListMenu(devices) {
	let xml = xmlbuilder.create('CiscoIPPhoneMenu')
		.ele("Title","Device List").up()
		.ele("Prompt", "Please Select Correct Profile").up();
	let url = "http://"+process.env.SERV_ADDR+":"+process.env.HTTP_PORT+
	"/etaps/submit?device=";
	devices.forEach((ele)=> {
		xml.ele("MenuItem")
			.ele("Name", ele).up()
			.ele("URL", url+ele).up().up()
	});
	xml.up();
	return xml;
}

function phoneTaps(name, pattern, resultCB) {
	let fakeName, line, e164Pattern = pattern, lineOps = new LineOperations();
	let httpOpts = {
		host: process.env.SERV_ADDR, port: process.env.HTTP_PORT,
		path: process.env.AXL_API_PATH, method: 'getLine',
		headers: {
			'Authorization': process.env.AUTH_HASH,
			'Content-Type': 'text/xml; charset=utf-8',
		},
		rejectUnauthorized: false
	};
	if (process.env.E164_DN === 'true') {
		e164Pattern = '+'+pattern
	}
	let body = lineOps.getLine(e164Pattern, process.env.DN_PT,
		{associatedDevices:{}}).body;
	let request = new Request(httpOpts, body);

	request.sendRequest().then((response)=> {
		let line = response.result["ns:getLineResponse"][0]["return"][0]["line"][0];
		let devices = line.associatedDevices;

		if (!devices) {
			throw new Error("there is no profile associated with this extension");
		}

		let filteredDev = devices.filter((macAddress)=> {
			return macAddress.includes(pattern);
		});
		return devices
	}).then(async (devices)=> {
		if (devices.length === 1) {
			fakeName = devices[0]
		} else {
			httpOpts.method = "getPhone";
			device.forEach((device) => {
				
			});
		}
	}).catch((err)=>{
		//console.log(err.message);
		let prompt = "Encountered an error";
		let text = err.message;
		resultCB(etapsRes(prompt,text));
	});

	/*then((response)=>{
		return request.removePhone(name);
	},(err)=>{
		throw new Error(err.message);
	}).then((response)=>{
		return request.updatePhoneName(fakeName,name);
	},(err)=>{
		throw new Error(err.message);
	}).catch((err)=>{
		console.log(err.message);
	});*/
}

function etapsRes(prompt,text){
	let xml = "<CiscoIPPhoneText><Title>meTaps</Title>";
	xml += "<Prompt>"+prompt+"</Prompt>"+
			"<Text>"+text+"</Text>"+
			"</CiscoIPPhoneText>";
	return xml;
}

module.exports.etaps = etaps;
