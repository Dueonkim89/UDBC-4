const express = require("express");
const bodyParser = require('body-parser');

//import BlockChain and Block class
const { Blockchain } = require('./simpleChain');
const { Block } = require('./simpleBlock');

//import helper functions
const { checkValidation } = require('./utils/helper');

const app = express();
const port = process.env.PORT || 8000;
const newBlockChain = new Blockchain();

app.use(bodyParser.json());

app.get("/block/:height", (req, res) => {
	const height = req.params.height;
	newBlockChain.getBlock(height).then( block => {	
		res.send(block);
	}).catch(error => res.status(400).send(error));		
});

app.post("/block", (req,res) => {
	const blockData = req.body.data;
	if (!blockData) {
		res.status(404).send('Please provide a block body');
	} else {
		newBlockChain.addBlock(new Block(blockData)).then(block => {
			res.send(block);
		}).catch(error => res.status(400).send(error));	
	}
});

app.post("/requestValidation", (req,res) => {
	const address = req.body.address;
	
	if (!address) {
		res.status(404).send('Please provide a blockchain identity');
	} else {
		// invoke helper function
		const valObject = checkValidation(address);
		res.send(valObject);
	}
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

