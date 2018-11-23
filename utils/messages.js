const missingInfoForStarPosting = `<pre>
Please provide a valid star object. Star must contain ra (right_ascension), dec (declination) 
and a star story limited to 500 bytes. See below for a valid star object:

"star": {
    "ra": "16h 29m 1.0s",
    "dec": "-26° 29' 24.9",
    "story": "Found star using https://www.google.com/sky/"
}
	
</pre>	
`;

const missingBlockBody = 'Please provide your wallet address and a star object.';
const invalidASCII = 'Your ASCII text contains invalid characters. Please try again.';
const storyIsTooLong = 'Star story can have a maximum length of 250 words or 500 bytes. Please shorten your story.';
const invalidSignature = 'Your signature is invalid. Please make sure you have the correct message.';
const validRequestExpired = `Your 30 min window to submit star data has expired. Please obtain a new validation request.`;
const requestAlreadyValidated = `Your request is already validated. Please submit a star data within your validation window`;
const missingValidationRequest = `Please submit a validation request at the url /requestValidation`;
const notValidated = `Please validate your request with the correct signature before trying to submit a star.`;

const starAlreadyPosted = function(timeWindow) {
	return `You have already posted a star object with that wallet address. Please wait ${timeWindow} seconds or use another
	wallet address`;
}

const missingAddyOrSig = `<pre>
Please provide a blockchain identity and a signature in the body of your request.
Example: 
{
	"address": "12345678910",
	"signature": "My signature"
}
</pre>	
`;


module.exports = {
	missingInfoForStarPosting,
	missingBlockBody,
	invalidSignature,
	invalidASCII,
	storyIsTooLong,
	validRequestExpired,
	requestAlreadyValidated,
	missingValidationRequest,
	missingAddyOrSig,
	notValidated,
	starAlreadyPosted
}