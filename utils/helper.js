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



module.exports = {
	isASCII,
	checkBytesOfStory
}
