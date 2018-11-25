const { getLevelDBData, addLevelDBData, getLevelDB } = require('./levelSandbox');
const { Blockchain } = require('./simpleChain');
const { Block } = require('./simpleBlock');
const hex2ascii = require('hex2ascii');
const { isASCII, checkBytesOfStory } = require('./utils/helper');
const { testData } = require('./testData');

//update data for future testing purposes
function modifyData(key, value) {
	getLevelDBData(key).then(block => {
		let parsedBlock = JSON.parse(block);
		parsedBlock.body = value;
		addLevelDBData(key, JSON.stringify(parsedBlock));
		console.log('Block body has been changed');
	}).catch(error => {
		console.log(`Unable to change data for block #${key}`);
	});	
}

//create new instance of blockchain
const myBlockChain = new Blockchain();


(function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block(testData[i]);
        myBlockChain.addBlock(blockTest);
        i++;
        if (i < 10) theLoop(i);
    }, 1000);
  })(0);

//console.log(hex2ascii('6C 6F 6C 20 66 75 63 6B 20 79 6F 75'));

/*
const story = `fdsfdsfdsfdsfdsdfdsfdsfds8787vcx978xc798vxcihjvihxcicxv7cx76hijkjsdf76dhsdfjipsdiuewruinldfdsfdsfdsfdsff
mxcvhjxchodsjkoffdsfdsfdsfdsfs89uf89uuuuuewf79cvkjxcnb,nbxcbnxcvzcxzxc78v7xcijhvjhixcvjhbnxcvhjxcvuvcxdsfjhsdfsdfjhisdjhisdhdsfsdfsddsfdssdf
fdsfdsfdsfdsfdsdfdsfdsfds8787vcx978xc798vxcihjvihxcicxv7cx76hijkjsdf76dhsdfjipsdiuewruinldfdsfdsfdsfdsff
mxcvhjxchodsjkoffdsfdsfdsfdsfs89uf89uuuuuewf79cvkjxcnb,nbxcbnxcvzcxzxc78v7xcijhvjhixcvjhbnxcvhjxcvfdsfdsfdsfdsfdsdfdsfdsfds8787vcx978xc798vxcihjvihxcicxv7cx76hijkjsdf76dhsdfjipsdiuewruinldfdsfdsfdsfdsff
mxcvhjxchodsjkoffdsfdsfdsfdsfs89uf89uuuuuewf79cvkjxcnb,nbxcbnxcvzcxzxc78v7xcijhvjhixcvjhbnxcvhjxcv`;

console.log(checkBytesOfStory(story));*/