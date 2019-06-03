let Request = require("../api/SOAPRequest.js");
let LineOperations = require("../api/LineOperations.js");
let PhoneOperations = require("../api/PhoneOperations.js");
let parser = require("../api/msgparser.js");
let xmlbuilder = require('xmlbuilder');
let fs = require('fs');

function tapMenu(name) {
	let url = "http://"+process.env.SERVER_ADDR+":"+process.env.HTTP_PORT+
	"/tap/phone/start?name="+name;
	let xml = xmlbuilder.create("CiscoIPPhoneInput")
		.ele("Title", "Enter Extension").up()
		.ele("URL", url).up()
		.ele("InputItem").ele("DisplayName", "Extension").up()
										 .ele("QueryStringParam", "pattern").up()
										 .ele("DefaultValue").up()
										 .ele("InputFlags", "N").up().up()
	return xml.end();
}

function deviceListMenu(pattern, devices, devDesc) {
	let xml = xmlbuilder.create('CiscoIPPhoneMenu')
		.ele("Title","Device List").up()
		.ele("Prompt", "Please Select Correct Profile").up();
	let url = "http://"+process.env.SERV_ADDR+":"+process.env.HTTP_PORT+
	"/tap/continue/submit?name=#DEVICENAME#&pattern="+pattern+"&newname=";
	devices.forEach((ele)=> {
		xml.ele("MenuItem")
			.ele("Name", devDesc[ele]).up()
			.ele("URL", url+ele).up().up()
	});
	xml.up();
	return xml.end();
}

function continueTap(name, newName, pattern, resultCB) {
}

function doPhoneTap(name, pattern, resultCB) {
	console.log(name,pattern);
	let fakeName, line, e164Pattern = pattern, lineOps = new LineOperations();
	let request = new Request();
	request.httpOptions = {
		host: process.env.CUCM_HOST, port: process.env.CUCM_PORT,
		path: process.env.AXL_API_PATH, method: 'getLine',
		headers: {
			'Authorization': process.env.AUTH_HASH,
			'Content-Type': 'text/xml; charset=utf-8',
			'SoapAction':'CUCM:DB ver=11.5 getLine'
		},
		rejectUnauthorized: false
	};
	if (process.env.E164_DN === 'true') {
		e164Pattern = '\\+'+pattern
	}
	request.body = lineOps.getLine(e164Pattern, process.env.DN_PT,
		{associatedDevices:{device:{}}});

	request.createSoapEnvelope("axl","11.5");
	request.transport = 'https';
	request.sendRequest().then((result)=> {
		console.log(result)
		let line = parser.parseResult(result);
		let devices = line.associatedDevices;

		if (!devices) {
			throw new Error("there is no profile associated with this extension");
		}

		let filteredDev = devices.filter((macAddress)=> {
			return macAddress.includes(pattern);
		});
		return devices
	}).then((devices)=> {
		let devDesc = {};
		if (devices.length === 1) {
			fakeName = devices[0]
		} else {
			request.httpOptions.method = "getPhone";
			let phoneOps = new PhoneOperations();
			phoneOps.returnedTags = {name:{}, description:{}};
			devices.forEach(async (device) => {
				phoneOps.name = device;
				request.body = phoneOps.getPhone();
				const result = await request.sendRequest();
				let getPhoneResp = parser.parseResult(result);
				let desc = getPhoneResp["ns:getPhoneResponse"][0].return[0].description[0];
				console.log(desc);
				let st = Number(process.env.DEV_DESC_ST);
				if (!st || st >= 64 || st < 0) st = 0;
				if (desc.length === 0) desc = device;
				else if (desc.length <= st) st = 0;
				devDesc[device] = desc.slice(st, desc.length);
			});
			resultCB(deviceListMenu(pattern, devices, devDesc));
		}
	}).catch((err)=>{
		console.log(err);
		let prompt = "Encountered an error";
		let text = err.message;
		resultCB(tapRes(prompt,text));
	});
}

function tapRes(prompt,text) {
	let xml = xmlbuilder.create('CiscoIPPhoneMenu')
		.ele("Title", "metap").up()
		.ele("Prompt", prompt).up()
		.ele("Text", text).up();
	return xml.end();
}

module.exports.tapMenu = tapMenu;
module.exports.doPhoneTap = doPhoneTap;
module.exports.deviceListMenu = deviceListMenu;
