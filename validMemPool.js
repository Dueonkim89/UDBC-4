const { memPool } = require('./memPool');

//inherit from memPool class all methods
class validMemPool extends memPool {
	constructor(data){
		super();
		this.validMemPool = []
    }
	
	//function to send JSON response for /message-signature/validate
	//scoping issue with name of argument, changing it to addy!
	createResponseForValidSig(addy) {
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
		this.validMemPool.push(response);
		return response;
	}	
	
	//check if specific address already is validated
	alreadyValidated(addy) {
		let exist = this.validMemPool.filter(request => request.status.address === addy);
		return exist.length ? true : false;
	}
	

}


module.exports = {
	validMemPool
}