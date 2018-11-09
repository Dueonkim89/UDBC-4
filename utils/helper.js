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

//function to validate user's signature
function validateSignature(address, signature) {
	console.log(address, signature);
}

module.exports = {
	checkValidation
}
