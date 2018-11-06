const express = require("express");
const bodyParser = require('body-parser');

const { Blockchain } = require('./simpleChain');
const { Block } = require('./simpleBlock');

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

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});

