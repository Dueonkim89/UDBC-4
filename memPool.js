// bitcoin libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

class memPool {
	constructor(data){
		this.memPool = []
    }
	
	//check if the validation object exists.
	checkValidation(address, validated=null) {
		let previousRequest = this.memPool.filter(request => request.address === address);
		//if validated. just send the request.
		if (validated) {
			return previousRequest[0];
		}
		//if previousRequest exists, find new validation window.
		if (previousRequest.length) {
			let valRequest = this.calculateNewValidationWindow(previousRequest[0], 300000);
			//remove request within mempool that has the address
			this.memPool = this.memPool.filter(request => request.address !== address);
			//filter and push new object.
			this.memPool.push(valRequest);			
			console.log(this.memPool);
			//return the valRequest
			return valRequest;
		// else, create a new validation request
		} else {
			return this.createNewValidationRequest(address);
		}
	}	
	
	//recalculate the validation window
	calculateNewValidationWindow(request, timeLimit) {
		//calculate new available validation time.
		const timeAtRequest = parseInt(request.requestTimeStamp);
		const expirationTime = timeAtRequest + timeLimit;
		//if 5 min validation window is over. create new validation request
		if (new Date().getTime() >= expirationTime) {
			return this.createNewValidationRequest(request.address);
		// else create new 	validationWindow
		} else {
			request.validationWindow = `${(expirationTime - new Date().getTime()) /1000}`;
			return request;
		}
	}	
	
	// create new validation request.
	createNewValidationRequest(address) {
		const requestTimeStamp = new Date().getTime().toString();
		const validationWindow = 300;
		const message =`${address}:${requestTimeStamp}:starRegistry`;
		let newRequest = {address, requestTimeStamp, message, validationWindow};
		//remove request within mempool that has the address
		this.memPool = this.memPool.filter(request => request.address !== address);
		//filter and push new object.
		this.memPool.push(newRequest);	
		console.log(memPool);
		return newRequest;
	}	

	//check if user's signature is valid
	validateSignature(address, signature) {
		//make sure 5 min window is followed!
		this.checkValidation(address)
		// filter and map to get the message.
		const message = this.memPool.filter(request => request.address === address).map(request => request.message);
		//send boolean value of bitcoinMessage.verify
		return bitcoinMessage.verify(message[0], address, signature);
	}

	
}

module.exports = {
	memPool
}