# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Node.js Framework
Express.js

## Setup

Clone or download the repository

Install dependencies and run server script
- npm install
- npm run server (Project will be on port 8000)


## Testing

#### Endpoints
Easiest way to test the endpoints would be with postman or you can use the fetch API.

- POST Response http://localhost:8000/requestValidation

```
Provide your bitcoin wallet address as the address in the body of the request
```

```
var url = 'http://localhost:8000/requestValidation';
var data = {address: 'My bitcoin wallet address'};

fetch(url, {
  method: 'POST',
  body: JSON.stringify(data), 
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
   .then(response => console.log(response))
    .catch(error => console.log(error));
```

#### You will get back a response with the address, message, timestamp and validationWindow.

#### The validation window indicates the number of seconds you have to sign the message with your bitcoin wallet.


- POST Response http://localhost:8000/message-signature/validate

```
Provide your bitcoin wallet address as the address and your wallet signature as the signature in the body of the request.
```

```
var url = 'http://localhost:8000/message-signature/validate';
var data = {address: 'My bitcoin wallet address', signature: 'My wallet signature'};

fetch(url, {
  method: 'POST',
  body: JSON.stringify(data), 
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
   .then(response => console.log(response))
    .catch(error => console.log(error));
```

#### Once your signature has been validated, you will get back a response with your address, message, timestamp, messageSignature and new validation window.

#### The new validation window indicates the number of seconds you have to post a star object to the blockchain.


- POST Response http://localhost:8000/block

```
Provide your bitcoin wallet address as the address and your star object as the star in the body of the request.
```

```
var url = 'http://localhost:8000/block';
var star = { 
          "dec": "68° 52' 56.9",
          "ra": "16h 29m 1.0s",
          "story": "Found star using https://www.google.com/sky/"
};
var data = {address: 'My bitcoin wallet address', star};

fetch(url, {
  method: 'POST',
  body: JSON.stringify(data), 
  headers:{
    'Content-Type': 'application/json'
  }
}).then(res => res.json())
   .then(response => console.log(response))
    .catch(error => console.log(error));
```

#### Once the star has been successfully posted to the blockchain. You will receive the block that contains this star object as the response. 

- GET Response http://localhost:8000/block/:[height]

```
Provide the height of the block that you want to get information for.
```

```
fetch('http://localhost:8000/block/1')
  .then(response => response.json())
    .then(data => console.log(data))
      .catch(error => console.log(error));
```

- GET Response http://localhost:8000/stars/address:[address]

```
Provide the address of the block that you want to get information for.
```

```
fetch('http://localhost:8000/stars/address:123456789')
  .then(response => response.json())
    .then(data => console.log(data))
      .catch(error => console.log(error));
```

- GET Response http://localhost:8000/stars/hash:[hash]

```
Provide the hash of the block that you want to get information for.
```

```
fetch('http://localhost:8000/stars/hash:987654321gffdg4324asdsa')
  .then(response => response.json())
    .then(data => console.log(data))
      .catch(error => console.log(error));
```

#### IMPORTANT: Test file will not run if you run server first. So please cancel the server script and run test file first!

To test code:

1: Open a shell terminal and enter REPL. (Read-Evaluate-Print-Loop)
```
node
```
2: Load the test.js file inside the terminal.
```
.load test.js
```
3: Test file will instantiate a blockchain by the variable myBlockChain and 10 Test blocks will automatically be generated.

#### BlockChain Methods

1: To add a block: addBlock(newBlock)
```
This method will return a promise and MUST take a new instance of Block as the argument. 

Example: myBlockChain.addBlock(new Block('this is the block body')).then(block => // Do whatever you want with the block you just created);
```
2: Get block height: getBlockHeight()
```
This method will return a promise. 

Example: myBlockChain.getBlockHeight().then(height => // whatever you want to do with the height );
```
3: Get a block: getBlock(blockHeight)
```
This method will take the height of a specific block as the argument and return a promise.

Example:  myBlockChain.getBlock(5).then(block => {
            // whatever you want to do with the block
          }).catch(error => console.log(error));
```
4: Validate a block: validateBlock(blockHeight)
```
This method will take the height of a specific block as the argument.

Example: myBlockChain.validateBlock(7);
```
5: Validate the entire blockchain: validateChain()
```
Example: myBlockChain.validateChain();
```

#### Mutate Block

1: In addition to blockchain methods. This file comes with a function to mutate the body of the block.
```
This method will take the height of the block as the first argument and new value for the body of the block as the second argument.

modifyData(blockHeight, value)

Example: modifyData(4, 'changing the body of the fourth block'))
```
