import React from "react";
import moment from "moment";
import sha256 from "crypto-js/sha256";

import DefaultBlock from "../DefaultBlock";

class Blockchain extends React.Component {
  // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.state = {
      distributedChain: [],
      difficulty: props.difficulty || 2
    };
  }

  componentWillMount() {
    this.createGenesisBlock();
  }

  calculateHash = props => {
    const { index, timestamp, data, previousHash = "", nonce } = props;
    return sha256(
      index + previousHash + timestamp + JSON.stringify(data) + nonce
    ).toString();
  };

  getCurrentTime = () => moment().format("LL h:mm:ss:SSS A");

  createGenesisBlock = () => {
    const { chain, updateChain } = this.props;
    updateChain(
      [...chain].concat([
        {
          index: 0,
          timestamp: this.getCurrentTime(),
          data: "Genesis block",
          previousHash: "0",
          hash: "0",
          nonce: 0
        }
      ])
    );
  };

  getLatestBlock = () => {
    const { chain } = this.props;
    const latestBlock = chain[chain.length - 1];
    return latestBlock;
  };

  addBlock = () => {
    const { distributedChain } = this.state;
    const { chain, updateChain } = this.props;

    if (chain.length < 1) {
      this.createGenesisBlock();
      return false;
    }

    const latestBlock = this.getLatestBlock();

    const newBlockData = {
      index: latestBlock.index + 1,
      timestamp: this.getCurrentTime(),
      data: "You have recieved " + (latestBlock.index + 1) + " Devocoin",
      previousHash: latestBlock.hash
    };

    const generatedBlockData = this.mineBlock(newBlockData);

    const newBlock = { ...newBlockData, ...generatedBlockData };

    updateChain([...chain].concat([newBlock]));
    this.setState({
      distributedChain:
        distributedChain.length < 1
          ? [...chain].concat([newBlock])
          : [...distributedChain].concat([newBlock])
    });
  };

  mineBlock = block => {
    const latestBlock = this.getLatestBlock();
    const { difficulty } = this.state;
    let nonce = latestBlock.nonce;
    let hash = this.calculateHash(block);
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      nonce++;
      hash = this.calculateHash({ ...block, nonce });
      console.log("NONCE: " + nonce, "HASH: " + hash);
    }

    return { hash, nonce };
  };

  isChainValid = () => {
    const { distributedChain } = this.state;
    const { chain, notify = () => {} } = this.props;
    const prevBlock = this.getLatestBlock();
    console.log(chain);

    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (
        currentBlock.hash !== this.calculateHash(currentBlock) ||
        currentBlock.previousHash !== previousBlock.hash ||
        distributedChain.length !== chain.length
      ) {
        notify({
          title: "Woah!",
          message:
            distributedChain.length !== chain.length
              ? "Hold on, your chain does not match the other chains on the network.."
              : `This chain has been altered from it's original state. Check block: ${i}`
        });
        return false;
      }
    }
    notify({
      title: "Great!",
      message: "All the blocks in this chain are valid."
    });
    return true;
  };

  deleteBlock = index => {
    const { chain, updateChain } = this.props;
    const filteredChain = chain.filter(block => block.index !== index);
    updateChain(filteredChain);
  };

  render() {
    const { chain, block = <DefaultBlock /> } = this.props;
    const { distributedChain } = this.state;

    const {
      genButton = <button>Generate Block</button>,
      valButton = <button>Validate Chain</button>,
      editBlock
    } = this.props;

    return (
      <div>
        {React.cloneElement(genButton, { onClick: this.addBlock })}
        {React.cloneElement(valButton, {
          onClick: this.isChainValid,
          disabled: chain.length < 2
        })}
        {chain.map((b, i) =>
          React.cloneElement(block, {
            key: i,
            onEdit: editBlock,
            onDelete: this.deleteBlock,
            ...b
          })
        )}
      </div>
    );
  }
}

Blockchain.propTypes = {};

export default Blockchain;
