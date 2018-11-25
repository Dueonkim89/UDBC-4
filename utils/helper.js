const hex2ascii = require('hex2ascii');

//check if valid ASCII
function isASCII(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

//check if 500 bytes or under
function checkBytesOfStory(story) {
	const buf = Buffer.from(story, 'ascii');
	const length = Buffer.byteLength(buf);
	if (length > 500) {
		return false;
	} else {
		return buf.toString('hex');
	}
}

function decodeStory(block) {
	//if passed argument is an array.
	if (Array.isArray(block)) {
		//map through each iteration and add a storyDecoded property. Keep it simple with SPREAD SYNTAX.
		let mutatedArray = block.map(x => {
			return {...x, 
					body:{...x.body, 
						star: {...x.body.star, storyDecoded: hex2ascii(x.body.star.story)}				
					}			
				} 
		});		
		return mutatedArray;
	}
	//if not an array
	block.body.star.storyDecoded = hex2ascii(block.body.star.story);
	return block;
}


module.exports = {
	isASCII,
	checkBytesOfStory,
	decodeStory
}
