import logo from './logo.svg';
import './App.css';
import Web3 from "web3"
import { useState } from 'react';
import { web3Modal } from "./getProvider"
import '@trendmicro/react-buttons/dist/react-buttons.css';
import { Button, ButtonGroup } from "@trendmicro/react-buttons"


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
const YOUR_ADDRESS = "0x3a4e6eD8B0F02BFBfaA3C6506Af2DB939eA5798c"
const TOKEN_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" // USDC

function App() {

  const [signedTransactionData, setSignedTransactionData] = useState("")
  const [transaction, setTransaction] = useState(null)
  const [amountOfTokens, setAmountOfTokens] = useState(0)
  const [recipient, setRecipient] = useState("")

  async function connectWallet() {
    const provider = await web3Modal.connect();
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    window.web3 = web3;
    window.wallet = accounts[0];

    console.log(accounts[0])
  }

  async function signIt() {
    const web3 = window.web3;
    const wallet = window.wallet;
    var tokk = 13;
    setAmountOfTokens(web3.utils.toWei(tokk.toString()).toString())
    setRecipient(YOUR_ADDRESS)
    let contract = new web3.eth.Contract(contractABI, TOKEN_ADDRESS, { from: wallet })
    let data = contract.methods.transfer(YOUR_ADDRESS, web3.utils.toWei(tokk.toString()).toString()).encodeABI();
    var rawTx = {
      chainId: 1,
      from: wallet,
      to: TOKEN_ADDRESS,
      value: "0",
      data: data
    }
    console.log(rawTx)
    try {
      web3.eth.signTransaction(rawTx).then(signed => {
        console.log(signed)
        rawTx["signedTx"] = signed
        rawTx["amountOfTokens"] = amountOfTokens
        rawTx["recipient"] = recipient
        setTransaction(rawTx)
        setSignedTransactionData(signed)
      }).catch(err => {
        console.log(err)
        alert("Error signing transaction")
      })

    } catch (error) {
      console.log(error);
      alert("Sorry, metamask is not supported.")
    }
  }

  function submitTransaction() {
    console.log(transaction)
    const web3 = window.web3;
    let address = web3.eth.accounts.recoverTransaction(transaction.signedTx)
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Use USDC as Gas
        </p>
        <div style={{
          padding: "10px"
        }}>
          <Button btnStyle="primary" btnSize="lg" onClick={connectWallet} >Connect</Button>
          <Button btnStyle="primary" btnSize="lg" onClick={signIt} >Sign</Button>
          <Button btnStyle="primary" btnSize="lg" onClick={submitTransaction} >Submit</Button>
        </div>
      </header>
    </div>
  );
}

export default App;
