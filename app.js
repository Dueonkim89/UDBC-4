const express = require("express");
const bodyParser = require('body-parser');

//import BlockChain, Block and mempool class
const { Blockchain } = require('./simpleChain');
const { Block } = require('./simpleBlock');
const { memPool } = require('./memPool');


//import helper functions 
const { isASCII, checkBytesOfStory, decodeStory } = require('./utils/helper');
// import error messages
const { missingInfoForStarPosting, missingBlockBody, invalidSignature, requestAlreadyValidated, validRequestExpired, 
missingValidationRequest, missingAddyOrSig, invalidASCII, storyIsTooLong, notValidated, starAlreadyPosted 
} = require('./utils/messages');


const app = express();
const port = process.env.PORT || 8000;
const newBlockChain = new Blockchain();
const newMemPool = new memPool();

app.use(bodyParser.json());

//get block by block height
app.get("/block/:height", (req, res) => {
	const height = req.params.height;
	console.log(height);
	newBlockChain.getBlock(height).then( block => {	
		//invoke decodeStory helper function
		let data = decodeStory(block);
		res.send(data);
	}).catch(error => res.status(400).send(error));		
});

//Get block by address
app.get("/stars/address:address", (req, res) => {
	const address = req.params.address.slice(1);	
	newBlockChain.getBlockByAddressOrHash('address', address).then( block => {			
		//put each block in array through the helper decodeStory function
		const data = decodeStory(block);
		res.send(data);
	}).catch(error => res.status(400).send(error));	;			
});

//get block by block hash
app.get("/stars/hash:hash", (req, res) => {
	const hash = req.params.hash.slice(1);;
	newBlockChain.getBlockByAddressOrHash('hash', hash).then( block => {
		//put the block through the helper decodeStory function
		const data = decodeStory(block[0]);
		res.send(data);	
	}).catch(error => res.status(400).send(error));	
});

//post a block
app.post("/block", (req,res) => {
	const { address, star } = req.body;
	
	//if address or star is missing in body of request
	if (!address || !star) {
		return res.status(404).send(missingBlockBody);
	}
	
	//check if request is not in validMemPool
	if (!newMemPool.alreadyValidated(address)) {
		return res.status(404).send(notValidated);
	}
	
	//check if valid request has expired 
	if (newMemPool.checkIfVRequestExpired(address)) {
		return res.status(400).send(validRequestExpired);
	}
	
	const request = newMemPool.getRequestFromVMemPool(address);
	//check is user already posted a star
	if (!request.registerStar) {
		return res.status(401).send(starAlreadyPosted(request.status.validationWindow));
	}
	
	const { story, dec, ra } = star;
	
	//if stor, dec, or ra is missing in star object
	if (!story || !dec || !ra) {
		return res.status(400).send(missingInfoForStarPosting);
	}
	
	//if invalid ascii text
	if (!isASCII(story)) {
		return res.status(400).send(invalidASCII);
	}
	//make sure story isnt over 500 bytes.
	if (!checkBytesOfStory(story)) {
		return res.status(400).send(storyIsTooLong);
	}
	
	const body = {
		address, 
		star: {
			ra,
			dec,
			story: Buffer.from(story).toString('hex')
		}
	};
	//add block
	newBlockChain.addBlock(new Block(body)).then(block => {
		//make sure to remove request from memPool& vMemPool
		newMemPool.updateVMemPool(address);
		newMemPool.updateMemPool(address);
		//invoke helper function to add storyDecoded property.
		let data = decodeStory(block);		
		res.send(data);		
	}).catch(error => res.status(400).send(error));	
});

app.post("/requestValidation", (req,res) => {
	const address = req.body.address;	
	//if address is missing
	if (!address) {
		return res.status(404).send('Please provide a blockchain identity');
	} 
	//if valid request has expired.
	if (newMemPool.alreadyValidated(address) && newMemPool.checkIfVRequestExpired(address)) {
		//reset the vMemPool
		newMemPool.updateVMemPool(address);
	}
	
	//if request has already been validated
	if (newMemPool.alreadyValidated(address)) {
		return res.status(400).send(requestAlreadyValidated);
	}	
	// invoke helper function
	const valObject = newMemPool.checkValidation(address);
	res.send(valObject);
});

app.post("/message-signature/validate", (req,res) => {
	const {address, signature} = req.body;
	
	if (!address || !signature) {
		return res.status(404).send(missingAddyOrSig);
	}
	
	if (!newMemPool.getRequestFromMemPool(address).length) {
		return res.status(404).send(missingValidationRequest);
	}
	
	try {
		if (newMemPool.validateSignature(address, signature)) {
			//if validRequest already exists in validMemPool and is expired
			if (newMemPool.alreadyValidated(address) && newMemPool.checkIfVRequestExpired(address)) {
				return res.status(400).send(validRequestExpired);
				//else, send valid request. The validation window must update everytime.
			} else {
				const response = newMemPool.createResponseForValidSig(address);
				res.send(response);			
			}
		} else {
			res.status(401).send(invalidSignature);
		}
	} catch(e) {
		res.status(400).send('Error trying to valid your signature');
	}	
});


app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

