// bitcoin libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

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

// function to recalculate the validation window
function calculateNewValidationWindow(request, timeLimit) {
	//calculate new available validation time.
	const timeAtRequest = parseInt(request.requestTimeStamp);
	const expirationTime = timeAtRequest + timeLimit;
	//if 5 min validation window is over. create new validation request
	if (timeLimit === 300000 && new Date().getTime() >= expirationTime) {
		return createNewValidationRequest(request.address);
	// else if 30 min window is over, set messageSig to false.
	} else if (timeLimit === 1800000 && new Date().getTime() >= expirationTime) {
		request.messageSignature = false;
		return request;
	// else create new 	validationWindow	
	} else {
		request.validationWindow = `${(expirationTime - new Date().getTime()) /1000}`;
		return request;
	}
}

//check if 30 min window is over for valid request within validMemPool
function checkIfVRequestExpired(addy) {
	//grab request from validMemPool
	let currentRequest = this.validMemPool.filter(request => request.status.address === addy);
	// destruct status then invoke calculateNewValidationWindow(request, timeLimit)
	const { status } = currentRequest[0];
	const updatedVRequest = this.calculateNewValidationWindow(status, 1800000);
	// if messageSig is falsey.. we know time has expired
	if (!updatedVRequest.messageSignature) {
		//mutate validMemPool to remove this request
		this.validMemPool = this.validMemPool.filter(request => request.status.address !== addy);
		return true;
	} else {
		return false;
	}
}




module.exports = {
	isASCII,
	checkBytesOfStory
}
