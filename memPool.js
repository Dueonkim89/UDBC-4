// bitcoin libraries
const bitcoin = require('bitcoinjs-lib');
const bitcoinMessage = require('bitcoinjs-message');

class memPool {
	constructor(data){
		this.memPool = [],
		this.validMemPool = []
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
		if (timeLimit === 300000 && new Date().getTime() >= expirationTime) {
			return this.createNewValidationRequest(request.address);
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

	//function to send JSON response for /message-signature/validate
	//scoping issue with name of argument, changing it to addy!
	createResponseForValidSig(addy) {
		//check if already validated, if so send new updated validation window
		if (this.alreadyValidated(addy)) {
			// grab request
			//destruct the status
			// send it into calculateNewValidationWindow with proper time 
			
			// recreate validation request
			//invoke updateValidMemPool(address)
			//push it into validMemPool
			//return updated request
			
		} else {
			const requestInfo = this.checkValidation(addy, 'validated');
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
			//mutate validMemPool to remove this request with same address. Only one allowed per 30 minutes.
			this.updateValidMemPool(address);
			this.validMemPool.push(response);
			return response;			
		}
	}

	//check if specific address already is validated within validMemPool
	alreadyValidated(addy) {
		let exist = this.validMemPool.filter(request => request.status.address === addy);
		return exist.length ? true : false;
	}

	//check if 30 min window is over for valid request within validMemPool
	checkIfVRequestExpired(addy) {
		//grab request from validMemPool
		let currentRequest = this.validMemPool.filter(request => request.status.address === addy);
		// destruct status then invoke calculateNewValidationWindow(request, timeLimit)
		const { status } = currentRequest[0];
		const updatedVRequest = this.calculateNewValidationWindow(status, 1800000);
		// if messageSig is falsey.. we know time has expired
		return !updatedVRequest.messageSignature ? true : false;
	}

	//method to mutate validMemPool and update with most recent valid request
	updateValidMemPool(address) {
		this.validMemPool = this.validMemPool.filter(request => request.status.address !== address);
	}	
}

module.exports = {
	memPool
}