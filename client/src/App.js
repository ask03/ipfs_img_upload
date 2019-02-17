import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from "./ipfs";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null, buffer: null,
  ipfsHash: "" };

  constructor(props) {
    super(props)
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      const ipfsHash = await instance.methods.get().call({from:accounts[0]});
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance, ipfsHash });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  captureFile(event) {
    console.log('capture file...');
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  onSubmit(event) {
    event.preventDefault()
    const {accounts, contract} = this.state;
    console.log('on submit...');

    ipfs.files.add(this.state.buffer, (err, result) => {
      if(err) {
        console.log(err)
        return
      }
      contract.methods.set(result[0].hash).send({from:accounts[0]}).then((r) => {
        console.log(r);
        this.setState({ipfsHash: result[0].hash})
        console.log('ipfsHash', this.state.ipfsHash);
      })
    })

  }

  render() {
    // if (!this.state.web3) {
      //   return <div>Loading Web3, accounts, and contract...</div>;
      // }
      return (
        <div className="App">
        <h1>Your Image</h1>
        <p>This image is stored on IPFS and The Ethereum Blockchain!</p>
        <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
        <h2>Upload Image</h2>
        <form onSubmit={this.onSubmit}>
        <input type="file" onChange={this.captureFile} />
        <input type="submit" />
        </form>

        </div>
      );
    }

  }

  export default App;
