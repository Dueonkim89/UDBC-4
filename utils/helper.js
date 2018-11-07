//to store the wallets that need to be validated.
const memPool = [];

//function to create or update the validation object.
function createValidationObject(address) {
	let previousRequest = memPool.filter(request => request.address === address);
	//if previousRequest exists, find new validation window.
	if (previousRequest.length) {
		console.log('to be built');
		//calculateNewValidationWindow(address);
		//spread syntax or concat the 2 arrays together that will filter and
		//not filter the prevRequest
	// else, send a new validation request
	} else {
		//create new validation request
		return createNewValidationRequest(address);
	}
}

// function to recalculate the validation window
function calculateNewValidationWindow(address) {
	//calculate new available validation time.
	console.log('to be built');
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

module.exports = {
	createValidationObject
}
