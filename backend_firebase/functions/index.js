const functions = require("firebase-functions");
import Web3 from "web3"
require('dotenv').config()


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const web3 = new Web3(process.env.INFURA_URL);
const YOUR_ADDRESS = process.env.YOUR_ADDRESS;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS // USDC

let contractABI = [
    // transfer
    {
        'constant': false,
        'inputs': [
            {
                'name': '_to',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'transfer',
        'outputs': [
            {
                'name': '',
                'type': 'bool'
            }
        ],
        'type': 'function'
    }
]

async function getSignedTransaction(to, value) {
    let gasPrice = await web3.eth.getGasPrice()
    let sendingValue = (parseInt(gasPrice) * parseInt(value)) + (parseInt(gasPrice) * 100000)
    var rawTx = {
        chainId: 4,
        from: YOUR_ADDRESS,
        to: to,
        value: sendingValue.toString(),
        data: ""
    }
    const output = await web3.eth.accounts.signTransaction(rawTx, process.env.YOUR_PRIVATE_KEY);
    return output;
}

exports.tokensToGas = functions.https.onRequest(async (request, response) => {
    // verify signed transaction
    const data = request.query;
    const signedTx = data.signedTx;
    const fromAddress = data.from;
    const amountOfTokens = data.amountOfTokens;
    const recipient = data.recipient;
    if (web3.eth.accounts.recoverTransaction(signedTx) !== fromAddress) {
        response.send("Invalid signature");
    }
    // Check to field to be usdc, or any token you plan to use
    const toAddress = data.to;
    if (toAddress !== TOKEN_ADDRESS) {
        response.send("Invalid to address");
    }
    if (recipient !== YOUR_ADDRESS) {
        response.send("Invalid recipient");
    }

    let contract = new web3.eth.Contract(contractABI, "0x0c2205550392ad04c6FD81BED702bd02EC0b4426", { from: fromAddress })
    let txData = contract.methods.transfer(YOUR_ADDRESS, amountOfTokens).encodeABI();

    if (txData !== data.data) {
        response.send("Invalid data");
    }

    if (amountOfTokens !== 13 * (10 ** 18)) {
        response.send("Invalid amount of tokens");
    }

    // Currently only supporting normal eth transactions.
    const signedSendEthTx = await getSignedTransaction(fromAddress, 21000);   
    const tx = await web3.eth.sendSignedTransaction(signedSendEthTx.rawTransaction);
    await web3.eth.sendSignedTransaction(signedTx);
    response.send(tx);
});