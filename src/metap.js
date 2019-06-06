let Request = require("../api/SOAPRequest.js"),
		request = new Request(),
		LineOperations = require("../api/LineOperations.js"),
		PhoneOperations = require("../api/PhoneOperations.js"),
		parser = require("../api/msgparser.js"),
		xmlbuilder = require('xmlbuilder'),
		fs = require('fs');

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
		.ele("Title","Multiple Devices Detected").up()
		.ele("Prompt", "Select Correct Device").up();
	let url = "http://"+process.env.SERVER_ADDR+":"+process.env.HTTP_PORT+
	"/tap/continue/submit?name=#DEVICENAME#"+"&newname=";
	devices.forEach((ele)=> {
		xml.ele("MenuItem")
			.ele("Name", devDesc[ele]).up()
			.ele("URL", url+ele).up().up();
	});
	return xml.end();
}

function continueTap(fakeName, realName, resultCB) {
	request.httpOptions = {
		host: process.env.CUCM_HOST, port: process.env.CUCM_PORT,
		path: process.env.AXL_API_PATH, method: "POST",
		headers: {
			'Authorization': process.env.AUTH_HASH,
			'Content-Type': 'text/xml; charset=utf-8'
		},
		rejectUnauthorized: false
	};
	let phoneOps = new PhoneOperations();
	phoneOps.name = fakeName;
	request.body = phoneOps.removePhone();
	request.createSoapEnvelope("axl","11.5");
	request.transport = 'https';


	request.sendRequest().then((result)=> {
		console.log("phone deleted",result);
		return true;
	}).then((autoRegPhoneDeleted)=> {
		if (autoRegPhoneDeleted) {
			let updatePhone = phoneOps.updatePhone(fakeName, );
			updatePhone.newName(realName);
			request.body = updatePhone.body;
			return request.sendRequest();
		}
		return null;
	}).then((phoneUpdated)=> {
		if (phoneUpdated) {
			resultCB(tapRes("Attempting TAP","Phone will reset shortly.. please wait"));
			console.log("TAPS Complete");
		}
	}).catch((err)=> {
		resultCB(tapRes("Error Encountered", err.message));
	});
}

function doPhoneTap(name, pattern, resultCB) {
	let fakeName, line, e164Pattern = pattern, lineOps = new LineOperations();
	request.httpOptions = {
		host: process.env.CUCM_HOST, port: process.env.CUCM_PORT,
		path: process.env.AXL_API_PATH, method: "POST",
		headers: {
			'Authorization': process.env.AUTH_HASH,
			'Content-Type': 'text/xml; charset=utf-8'
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
		let line = parser.parseResult(result),
				devices = line["ns:getLineResponse"][0].return[0]
				.line[0].associatedDevices;
		console.log(devices);
		if (!devices || devices.length === 0) {
			throw new Error("there is no profile associated with this extension");
		}

		devices = devices[0].device;
		let filteredDev = devices.filter((macAddress)=> {
			return macAddress.includes(pattern);
		});
		return filteredDev;
	}).then(async (devices)=> {
		console.log(devices);
		let devDesc = {};
		if (devices.length === 1) {
			fakeName = devices[0];
			let prompt = "Device Found";
			resultCB(deviceFoundMenu(prompt, fakeName));
		} else if (devices.length > 1) {
			let phoneOps = new PhoneOperations();
			phoneOps.returnedTags = {name:{}, description:{}};
			for (let i = 0; i < devices.length ;i++) {
				phoneOps.name = devices[i];
				request.body = phoneOps.getPhone();
				console.log(request.body);
				const result = await request.sendRequest();
				let getPhoneResp = parser.parseResult(result),
						desc = getPhoneResp["ns:getPhoneResponse"][0].return[0].phone[0]
						.description[0];
				devDesc[devices[i]] = desc
				console.log(devDesc[devices[i]]);
			}
			let xml = deviceListMenu(pattern, devices, devDesc);
			resultCB(xml);
		} else {
			throw new Error("the DN "+pattern+" is not part of a devicename");
		}
	}).catch((err)=>{
		console.log(err);
		let prompt = "Encountered an error";
		let text = err.message;
		resultCB(tapRes(prompt,text));
	});
}

function deviceFoundMenu(prompt, fakeName) {
	let url = "http://"+process.env.SERVER_ADDR+":"+process.env.HTTP_PORT+
	"/tap/phone/continue?fakename="+fakeName+"&name=#DEVICENAME#";
	let xml = xmlbuilder.create('CiscoIPPhoneMenu')
		.ele("Title", "metap").up()
		.ele("Prompt", prompt).up()
		.ele("MenuItem")
			.ele("Name", fakeName).up()
			.ele("URL", url).up()
		.up();
	return xml.end();
}

function tapRes(prompt,text) {
	let xml = xmlbuilder.create('CiscoIPPhoneText')
		.ele("Title", "metap").up()
		.ele("Prompt", prompt).up()
		.ele("Text", text).up();
	return xml.end();
}

module.exports.tapMenu = tapMenu;
module.exports.doPhoneTap = doPhoneTap;
module.exports.deviceListMenu = deviceListMenu;
