const missingInfoForStarPosting = 
`
<!DOCTYPE html>
<pre>
Please provide a valid star object. Star must contain ra (right_ascension), dec (declination) 
and a star story limited to 500 bytes. See below for a valid star object:

"star": {
    "ra": "16h 29m 1.0s",
    "dec": "-26° 29' 24.9",
    "story": "Found star using https://www.google.com/sky/"
}
	
</pre>	
`;

const missingBlockBody = 'Please provide your wallet address and a star object';

const invalidSignature = 'Your signature is invalid. Please make sure you have the correct message';

module.exports = {
	missingInfoForStarPosting,
	missingBlockBody,
	invalidSignature
}