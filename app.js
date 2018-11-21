const express = require("express");
const bodyParser = require('body-parser');

//import BlockChain, Block and mempool class
const { Blockchain } = require('./simpleChain');
const { Block } = require('./simpleBlock');
const { memPool } = require('./memPool');


//import helper functions 
const { isASCII, checkBytesOfStory } = require('./utils/helper');
// import error messages
const { missingInfoForStarPosting, missingBlockBody, invalidSignature, requestAlreadyValidated,
validRequestExpired, missingValidationRequest, missingAddyOrSig } = require('./utils/messages');


const app = express();
const port = process.env.PORT || 8000;
const newBlockChain = new Blockchain();
const newMemPool = new memPool();

app.use(bodyParser.json());

app.get("/block/:height", (req, res) => {
	const height = req.params.height;
	newBlockChain.getBlock(height).then( block => {	
		res.send(block);
	}).catch(error => res.status(400).send(error));		
});

app.post("/block", (req,res) => {
	const { address, star } = req.body;
	
	if (!address || !star) {
		res.status(400).send(missingBlockBody);
	}
	const { story, dec, ra } = star;
	
	if (!story || !dec || !ra) {
		res.status(400).send(missingInfoForStarPosting);
	}
	
	/*const blockData = req.body.data;
	if (!blockData) {
		res.status(404).send('Please provide a block body');
	} else {
		newBlockChain.addBlock(new Block(blockData)).then(block => {
			res.send(block);
		}).catch(error => res.status(400).send(error));	
	}*/
});

app.post("/requestValidation", (req,res) => {
	const address = req.body.address;	
	//check if address is found in validated memPool. if so send message saying already validated.
	if (!address) {
		return res.status(404).send('Please provide a blockchain identity');
	} 
	
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
				res.status(400).send(validRequestExpired);
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

