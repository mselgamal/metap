let Request = require("../api/SOAPRequest.js"),
		request = new Request(),
		LineOperations = require("../api/LineOperations.js"),
		PhoneOperations = require("../api/PhoneOperations.js"),
		parser = require("../api/msgparser.js"),
		xmlbuilder = require('xmlbuilder');

/**
	@param {String} devicename
	@returns {String} xmlMenu
	constructs initial tap menu, prompting user for extension
*/
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

/**
	@param {String} pattern
	@param {list} devices
	@param {map} deviceDescription
	@returns {String} xmlMenu
	fucntion creates a menu of device description, this is only called when
	a phone extension is associated with multiple devices as "line 1"
*/
function deviceListMenu(devices, devDesc) {
	let xml = xmlbuilder.create('CiscoIPPhoneMenu')
		.ele("Title","Multiple Devices Detected").up()
		.ele("Prompt", "Select Correct Device").up();
	let url = "http://"+process.env.SERVER_ADDR+":"+process.env.HTTP_PORT+
	"/tap/phone/continue?name=#DEVICENAME#"+"&fakename=";
	devices.forEach((ele)=> {
		xml.ele("MenuItem")
			.ele("Name", devDesc[ele]).up()
			.ele("URL", url+ele).up().up();
	});
	return xml.end();
}

/**
	@param {String} fakeName
	@param {String} realName
	@param {function} resultCB
	@returns {String} xmlMenu
	function swapes phone profile mac with auto reg phone mac
	by removing auto reg phone and updating phone profile with mac
	resultCB is triggered when successful or when error is encountered
*/
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
	request.body = phoneOps.removePhone(realName);
	request.createSoapEnvelope("axl",process.env.CUCM_VER);
	request.transport = 'https';
	request.sendRequest().then((result)=> {
		return result;
	}).then((removePhoneResponse)=> {
		removePhoneResponse = parser.parseResult(removePhoneResponse); // throws exception during parse if failure is detected
		console.log("Auto Reg Phone removed token", JSON.stringify(removePhoneResponse));
		let updatePhone = phoneOps.updatePhone(fakeName);
		updatePhone.newName(realName);
		request.body = updatePhone.body;
		return request.sendRequest();
	}).then((phoneUpdatedResponse)=> {
		return parser.parseResult(phoneUpdatedResponse);
	}).then((phoneUpdated)=> {
		console.log("Phone updated token ", JSON.stringify(phoneUpdated));
		resultCB(tapRes("Attempting TAP","Phone will reset shortly.. please wait"));
		console.log("Taps complete");
	}).catch((err)=> {
		console.log("Error Encountered", err.message);
		resultCB(tapRes("Error Encountered", err.message));
	});
}

/**
	@param {String} pattern
	@param {function} resultCB
	function does a directory number lookup and identifies
	associated device(s) resultCB is triggered and devices
	are returned or error is encountered
*/
function doPhoneTap(pattern, resultCB) {
	let fakeName, e164Pattern = pattern, lineOps = new LineOperations();
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
	request.createSoapEnvelope("axl",process.env.CUCM_VER);
	request.transport = 'https';
	request.sendRequest().then((result)=> {
		let line = parser.parseResult(result),
				devices = line["ns:getLineResponse"][0].return[0]
				.line[0].associatedDevices;
		if (!devices || devices.length === 0) {
			throw new Error("there is no profile associated with this extension");
		}

		devices = devices[0].device;
		let filteredDev = devices.filter((macAddress)=> {
			return macAddress.includes(pattern);
		});
		return filteredDev;
	}).then(async (devices)=> {
		let devDesc = {};
		if (devices.length === 1) {
			fakeName = devices[0];
			let prompt = "Device Found";
			resultCB(deviceFoundMenu(prompt, fakeName));
		} else if (devices.length > 1) {
			let phoneOps = new PhoneOperations();
			let returnedTags = {name:{}, description:{}};
			for (let i = 0; i < devices.length ;i++) {
				request.body = phoneOps.getPhone(devices[i], returnedTags);
				const result = await request.sendRequest();
				let getPhoneResp = parser.parseResult(result),
						desc = formatDesc(getPhoneResp["ns:getPhoneResponse"][0].return[0].phone[0]
						.description[0]);
				devDesc[devices[i]] = desc
			}
			let xml = deviceListMenu(devices, devDesc);
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

/**
	@param {String} desc
	@return {String} desc with size == 65 chars
 */
function formatDesc(desc) {
	const MAX_CHARS = 65;
	let st = Number(process.env.DEV_DESC_ST);
	if (NaN || st >= 65) throw new Error("Invalid .env variable DEV_DESC_ST" + st);
	let end = desc.length <= st + MAX_CHARS ? desc.length :  st + MAX_CHARS;

	return desc.substring(st, end);
}

/**
	@param {String} prompt
	@param {String} fakeName
	@return {String} xmlString
	function returns menu for single matched device
*/
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

/**
	@param {String} prompt
	@param {String} text
	@return {String} xmlString
	function returns error message to phone
*/
function tapRes(prompt, text) {
	let xml = xmlbuilder.create('CiscoIPPhoneText')
		.ele("Title", "metap").up()
		.ele("Prompt", prompt).up()
		.ele("Text", text).up();
	return xml.end();
}

module.exports.tapMenu = tapMenu;
module.exports.doPhoneTap = doPhoneTap;
module.exports.continueTap = continueTap;
module.exports.deviceListMenu = deviceListMenu;