// bitcoin libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

//to store the wallets that need to be validated. will contain mutable data
let memPool = [];

//function to check if the validation object exists.
function checkValidation(address, validated=null) {
	let previousRequest = memPool.filter(request => request.address === address);
	//if validated. just send the request.
	if (validated) {
		return previousRequest[0];
	}
	//if previousRequest exists, find new validation window.
	if (previousRequest.length) {
		let valRequest = calculateNewValidationWindow(previousRequest[0]);
		//filter and push new object.
		memPool = memPool.filter(request => request.address !== address);
		memPool.push(valRequest);
		console.log(memPool);
		//return the valRequest
		return valRequest;
	// else, create a new validation request
	} else {
		return createNewValidationRequest(address);
	}
}

// function to recalculate the validation window
function calculateNewValidationWindow(request) {
	//calculate new available validation time.
	const timeAtRequest = parseInt(request.requestTimeStamp);
	const expirationTime = timeAtRequest + 300000;
	//if 5 min validation window is over. create new validation request
	if (new Date().getTime() >= expirationTime) {
		return createNewValidationRequest(request.address);
	// else create new 	validationWindow
	} else {
		request.validationWindow = `${(expirationTime - new Date().getTime()) /1000} seconds`;
		return request;
	}
}

// create new validation request.
function createNewValidationRequest(address) {
	const requestTimeStamp = new Date().getTime().toString();
	const validationWindow = '300 seconds';
	const message =`${address}:${requestTimeStamp}:starRegistry`;
	let newRequest = {address, requestTimeStamp, message, validationWindow};
	memPool.push(newRequest);
	console.log(memPool);
	return newRequest;
}

//function to check if user's signature is valid
function validateSignature(address, signature) {
	//make sure 5 min window is followed!
	checkValidation(address)
	// filter and map to get the message.
	const message = memPool.filter(request => request.address === address).map(request => request.message);
	//send boolean value of bitcoinMessage.verify
	return bitcoinMessage.verify(message[0], address, signature);
}

//function to send JSON response for /message-signature/validate
//scoping issue with name of argument, changing it to addy!
function createResponseForValidSig(addy) {
	const requestInfo = checkValidation(addy, 'validated');
	const {address, requestTimeStamp, message, validationWindow} = requestInfo;	
	let response =  {
	  "registerStar": true,
	  "status": {
		address,
		requestTimeStamp,
		message,
		validationWindow,
		"messageSignature": "valid"
	  }
	};
	return response;
}

//check if valid ASCII
function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

//check if 500 bytes or under
function checkBytesOfStory(story) {
	const buf = Buffer.from(story, 'ascii');
	const length = Buffer.byteLength(buf);
	if (length > 500) {
		return false;
	} else {
		return buf.toString('hex');
	}
}

module.exports = {
	checkValidation,
	validateSignature,
	createResponseForValidSig,
	isASCII,
	checkBytesOfStory
}
