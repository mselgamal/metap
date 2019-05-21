let request = require("../wsdl/requests.js");
let fs = require('fs');

function etaps(option,name,ext,resultCB) {
	request.setOptionsObj(option);
	let fakeName, line;
	request.getLine(ext).then((response)=>{
		let line = response.result["ns:getLineResponse"][0]["return"][0]["line"][0];
		let devices = line.associatedDevices[0];
		if (!devices) {
			throw new Error("there is no profile associated with this extension");
		}
		console.log(devices);
		let mac = devices.device.filter((phone) => {
			console.log(phone);
			return phone.includes(ext);
		});
		console.log(mac);
		if (mac.length === 1) {
			fakeName = mac[0];
		} else {
			throw new Error("no mac address found with correct format, available associated devices -> "
			+ devices.device);
		}

		let prompt = "ETAPS Service";
		let text = "starting ETAPS request...attempting to replace "+fakeName +" with "+name+", phone will reset soon.";
		resultCB(etapsRes(prompt,text));
		return name;
	}).catch((err)=>{
		//console.log(err.message);
		let prompt = "Encountered an error";
		let text = err.message;
		resultCB(etapsRes(prompt,text));
		throw new Error(err.message);
	}).then((response)=>{
		return request.removePhone(name);
	},(err)=>{
		throw new Error(err.message);
	}).then((response)=>{
		return request.updatePhoneName(fakeName,name);
	},(err)=>{
		throw new Error(err.message);
	}).catch((err)=>{
		console.log(err.message);
	});

	function etapsRes(prompt,text){
		let xml = "<CiscoIPPhoneText><Title>meTaps</Title>";
		xml += "<Prompt>"+prompt+"</Prompt>"+
				"<Text>"+text+"</Text>"+
				"</CiscoIPPhoneText>";
		return xml;
	}
}

module.exports.etaps = etaps;
