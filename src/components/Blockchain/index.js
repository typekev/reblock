"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

var _sha = require("crypto-js/sha256");

var _sha2 = _interopRequireDefault(_sha);

var _DefaultBlock = require("../DefaultBlock");

var _DefaultBlock2 = _interopRequireDefault(_DefaultBlock);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _toConsumableArray(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  } else {
    return Array.from(arr);
  }
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === "object" || typeof call === "function")
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError(
      "Super expression must either be null or a function, not " +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

var Blockchain = (function(_React$Component) {
  _inherits(Blockchain, _React$Component);

  function Blockchain(props) {
    _classCallCheck(this, Blockchain);

    var _this = _possibleConstructorReturn(
      this,
      (Blockchain.__proto__ || Object.getPrototypeOf(Blockchain)).call(
        this,
        props
      )
    );

    _initialiseProps.call(_this);

    _this.state = {
      distributedChain: [],
      difficulty: props.difficulty || 2
    };
    return _this;
  }

  _createClass(Blockchain, [
    {
      key: "componentWillMount",
      value: function componentWillMount() {
        this.createGenesisBlock();
      }
    },
    {
      key: "render",
      value: function render() {
        var _this2 = this;

        var _props = this.props,
          chain = _props.chain,
          _props$block = _props.block,
          block =
            _props$block === undefined
              ? _react2.default.createElement(_DefaultBlock2.default, null)
              : _props$block;
        var distributedChain = this.state.distributedChain;
        var _props2 = this.props,
          _props2$genButton = _props2.genButton,
          genButton =
            _props2$genButton === undefined
              ? _react2.default.createElement("button", null, "Generate Block")
              : _props2$genButton,
          _props2$valButton = _props2.valButton,
          valButton =
            _props2$valButton === undefined
              ? _react2.default.createElement("button", null, "Validate Chain")
              : _props2$valButton,
          editBlock = _props2.editBlock;

        return _react2.default.createElement(
          "div",
          null,
          _react2.default.cloneElement(genButton, { onClick: this.addBlock }),
          _react2.default.cloneElement(valButton, {
            onClick: this.isChainValid,
            disabled: chain.length < 2
          }),
          chain.map(function(b, i) {
            return _react2.default.cloneElement(
              block,
              _extends(
                {
                  key: i,
                  onEdit: editBlock,
                  onDelete: _this2.deleteBlock
                },
                b
              )
            );
          })
        );
      }
    }
  ]);

  return Blockchain;
})(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.calculateHash = function(props) {
    var index = props.index,
      timestamp = props.timestamp,
      data = props.data,
      _props$previousHash = props.previousHash,
      previousHash =
        _props$previousHash === undefined ? "" : _props$previousHash,
      nonce = props.nonce;

    return (0, _sha2.default)(
      index + previousHash + timestamp + JSON.stringify(data) + nonce
    ).toString();
  };

  this.getCurrentTime = function() {
    return (0, _moment2.default)().format("LL h:mm:ss:SSS A");
  };

  this.createGenesisBlock = function() {
    var _props3 = _this3.props,
      chain = _props3.chain,
      updateChain = _props3.updateChain;

    updateChain(
      [].concat(_toConsumableArray(chain)).concat([
        {
          index: 0,
          timestamp: _this3.getCurrentTime(),
          data: "Genesis block",
          previousHash: "0",
          hash: "0",
          nonce: 0
        }
      ])
    );
  };

  this.getLatestBlock = function() {
    var chain = _this3.props.chain;

    var latestBlock = chain[chain.length - 1];
    return latestBlock;
  };

  this.addBlock = function() {
    var distributedChain = _this3.state.distributedChain;
    var _props4 = _this3.props,
      chain = _props4.chain,
      updateChain = _props4.updateChain;

    if (chain.length < 1) {
      _this3.createGenesisBlock();
      return false;
    }

    var latestBlock = _this3.getLatestBlock();

    var newBlockData = {
      index: latestBlock.index + 1,
      timestamp: _this3.getCurrentTime(),
      data: "You have recieved " + (latestBlock.index + 1) + " Devocoin",
      previousHash: latestBlock.hash
    };

    var generatedBlockData = _this3.mineBlock(newBlockData);

    var newBlock = _extends({}, newBlockData, generatedBlockData);

    updateChain([].concat(_toConsumableArray(chain)).concat([newBlock]));
    _this3.setState({
      distributedChain:
        distributedChain.length < 1
          ? [].concat(_toConsumableArray(chain)).concat([newBlock])
          : [].concat(_toConsumableArray(distributedChain)).concat([newBlock])
    });
  };

  this.mineBlock = function(block) {
    var latestBlock = _this3.getLatestBlock();
    var difficulty = _this3.state.difficulty;

    var nonce = latestBlock.nonce;
    var hash = _this3.calculateHash(block);
    while (hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      nonce++;
      hash = _this3.calculateHash(_extends({}, block, { nonce: nonce }));
      console.log("NONCE: " + nonce, "HASH: " + hash);
    }

    return { hash: hash, nonce: nonce };
  };

  this.isChainValid = function() {
    var distributedChain = _this3.state.distributedChain;
    var _props5 = _this3.props,
      chain = _props5.chain,
      _props5$notify = _props5.notify,
      notify = _props5$notify === undefined ? function() {} : _props5$notify;

    var prevBlock = _this3.getLatestBlock();
    console.log(chain);

    for (var i = 1; i < chain.length; i++) {
      var currentBlock = chain[i];
      var previousBlock = chain[i - 1];

      if (
        currentBlock.hash !== _this3.calculateHash(currentBlock) ||
        currentBlock.previousHash !== previousBlock.hash ||
        distributedChain.length !== chain.length
      ) {
        notify({
          title: "Woah!",
          message:
            distributedChain.length !== chain.length
              ? "Hold on, your chain does not match the other chains on the network.."
              : "This chain has been altered from it's original state. Check block: " +
                i
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

  this.deleteBlock = function(index) {
    var _props6 = _this3.props,
      chain = _props6.chain,
      updateChain = _props6.updateChain;

    var filteredChain = chain.filter(function(block) {
      return block.index !== index;
    });
    updateChain(filteredChain);
  };
};

Blockchain.propTypes = {};

exports.default = Blockchain;
