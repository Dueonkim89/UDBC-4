// bitcoin libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

//to store the wallets that need to be validated. will contain mutable data
let memPool = [];

//function to check if the validation object exists.
function checkValidation(address) {
	let previousRequest = memPool.filter(request => request.address === address);
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
	// filter and map to get the message.
	const message = memPool.filter(request => request.address === address).map(request => request.message);
	//send boolean value of bitcoinMessage.verify
	return bitcoinMessage.verify(message[0], address, signature);
}

//function to send JSON response for /message-signature/validate
function createResponseForValidSig(address) {
	//to be worked on...
	// calculateNewValidationWindow(request)
	/* The Format
	{
	  "registerStar": true,
	  "status": {
		"address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
		"requestTimeStamp": "1532296090",
		"message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
		"validationWindow": 193,
		"messageSignature": "valid"
	  }
	}	*/	
}

module.exports = {
	checkValidation,
	validateSignature,
	createResponseForValidSig
}
