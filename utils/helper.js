// bitcoin libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

//to store the wallets that need to be validated. will contain mutable data
let memPool = [];
let validMemPool = [];

//function to check if the validation object exists.
function checkValidation(address, validated=null) {
	let previousRequest = memPool.filter(request => request.address === address);
	//if validated. just send the request.
	if (validated) {
		return previousRequest[0];
	}
	//if previousRequest exists, find new validation window.
	if (previousRequest.length) {
		let valRequest = calculateNewValidationWindow(previousRequest[0], 300000);
		//remove request within mempool that has the address
		memPool = memPool.filter(request => request.address !== address);
		//filter and push new object.
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
function calculateNewValidationWindow(request, timeLimit) {
	//calculate new available validation time.
	const timeAtRequest = parseInt(request.requestTimeStamp);
	const expirationTime = timeAtRequest + timeLimit;
	//if 5 min validation window is over. create new validation request
	if (new Date().getTime() >= expirationTime) {
		return createNewValidationRequest(request.address);
	// else create new 	validationWindow
	} else {
		request.validationWindow = `${(expirationTime - new Date().getTime()) /1000}`;
		return request;
	}
}

// create new validation request.
function createNewValidationRequest(address) {
	const requestTimeStamp = new Date().getTime().toString();
	const validationWindow = 300;
	const message =`${address}:${requestTimeStamp}:starRegistry`;
	let newRequest = {address, requestTimeStamp, message, validationWindow};
	//remove request within mempool that has the address
	memPool = memPool.filter(request => request.address !== address);
	//filter and push new object.
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
	const newValWindow = 1800 - validationWindow;
	let response =  {
	  "registerStar": true,
	  "status": {
		address,
		requestTimeStamp,
		message,
		validationWindow: newValWindow,
		"messageSignature": true
	  }
	};
	validMemPool.push(response);
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

//function to mutate validMemPool and update with most recent valid request
function updateValidMemPool(request) {
	
}


//check if 30 min window is over for valid request within validMemPool
function checkIfVRequestExpired(addy) {
	//grab request from validMemPool
	let currentRequest = validMemPool.filter(request => request.status.address === addy);
	// destruct status then invoke calculateNewValidationWindow(request, timeLimit)
	const { status } = currentRequest[0];
	const updatedVRequest = calculateNewValidationWindow(status, 1800000);
	// if messageSig is missing.. we know time has expired
	if (!updatedVRequest.messageSignature) {
		//mutate validMemPool to have most recent updatedVRequest
		validMemPool = ;
		return true;
	}
	// so return true and remove this request from the validMemPool
	
	// 
	
	const timeStamp = parseInt(currentRequest[0].status.requestTimeStamp);
	//1800000
	if (currentRequest[0].status.) {
		
	}
}



module.exports = {
	checkValidation,
	validateSignature,
	createResponseForValidSig,
	isASCII,
	checkBytesOfStory
}
