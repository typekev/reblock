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

var _sha = require("crypto-js/sha256");

var _sha2 = _interopRequireDefault(_sha);

var _DefaultBlock = require("../DefaultBlock");

var _DefaultBlock2 = _interopRequireDefault(_DefaultBlock);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _objectWithoutProperties(obj, keys) {
  var target = {};
  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }
  return target;
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

  // eslint-disable-line react/prefer-stateless-function
  function Blockchain(props) {
    _classCallCheck(this, Blockchain);

    var _this = _possibleConstructorReturn(
      this,
      (Blockchain.__proto__ || Object.getPrototypeOf(Blockchain)).call(
        this,
        props
      )
    );

    _this.calculateHash = function(blockData) {
      return (0, _sha2.default)(JSON.stringify(blockData)).toString();
    };

    _this.createGenesisBlock = function() {
      var _this$props = _this.props,
        chain = _this$props.chain,
        updateChain = _this$props.updateChain,
        getBlockObject = _this$props.getBlockObject;

      var genesisBlock = _extends({}, getBlockObject({ index: 0 }), {
        index: 0,
        previousHash: ""
      });
      var generatedBlockData = _this.mineBlock(genesisBlock);

      updateChain(
        []
          .concat(_toConsumableArray(chain))
          .concat([_extends({}, genesisBlock, generatedBlockData)])
      );
    };

    _this.getLatestBlock = function() {
      var chain = _this.props.chain;

      var latestBlock = chain[chain.length - 1];
      return latestBlock;
    };

    _this.addBlock = function() {
      var distributedChain = _this.state.distributedChain;
      var _this$props2 = _this.props,
        chain = _this$props2.chain,
        updateChain = _this$props2.updateChain,
        getBlockObject = _this$props2.getBlockObject;

      if (chain.length < 1) {
        _this.createGenesisBlock();
        return;
      }

      var latestBlock = _this.getLatestBlock();

      var newBlockData = _extends(
        {},
        getBlockObject({ index: latestBlock.index + 1 }),
        {
          index: latestBlock.index + 1,
          previousHash: latestBlock.hash
        }
      );

      var generatedBlockData = _this.mineBlock(newBlockData);

      var newBlock = _extends({}, newBlockData, generatedBlockData);

      updateChain([].concat(_toConsumableArray(chain)).concat([newBlock]));
      _this.setState({
        distributedChain:
          distributedChain.length < 1
            ? [].concat(_toConsumableArray(chain)).concat([newBlock])
            : [].concat(_toConsumableArray(distributedChain)).concat([newBlock])
      });
    };

    _this.mineBlock = function(block) {
      var latestBlock = _this.getLatestBlock();
      var difficulty = _this.state.difficulty;

      var nonce = latestBlock ? latestBlock.nonce : 0;
      var hash = _this.calculateHash(block);
      while (
        hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
      ) {
        nonce++;
        hash = _this.calculateHash(_extends({}, block, { nonce: nonce }));
      }
      console.log(
        "currentBlockData HASH ADDNEW",
        _extends({}, block, { nonce: nonce })
      );
      return { hash: hash, nonce: nonce };
    };

    _this.isChainValid = function() {
      var distributedChain = _this.state.distributedChain;
      var _this$props3 = _this.props,
        chain = _this$props3.chain,
        _this$props3$notify = _this$props3.notify,
        notify =
          _this$props3$notify === undefined
            ? function() {}
            : _this$props3$notify,
        chainAlteredErrorMessage = _this$props3.chainAlteredErrorMessage,
        chainLengthErrorMessage = _this$props3.chainLengthErrorMessage,
        chainValidMessage = _this$props3.chainValidMessage;

      var prevBlock = _this.getLatestBlock();

      for (var i = 1; i < chain.length; i++) {
        var currentBlock = chain[i];
        var previousBlock = chain[i - 1];

        var currentBlockHash = currentBlock.hash,
          nonce = currentBlock.nonce,
          currentBlockData = _objectWithoutProperties(currentBlock, [
            "hash",
            "nonce"
          ]);

        if (
          currentBlockHash !==
            _this.calculateHash(
              _extends({}, currentBlockData, { nonce: nonce })
            ) ||
          currentBlock.previousHash !== previousBlock.hash ||
          distributedChain.length !== chain.length
        ) {
          notify(
            distributedChain.length === chain.length
              ? chainAlteredErrorMessage || {
                  title: "Woah!",
                  message:
                    "This chain has been altered from it's original state. Check block: " +
                    i
                }
              : chainLengthErrorMessage || {
                  title: "Woah!",
                  message:
                    "Hold on, your chain does not match the other chains on the network.."
                }
          );
          return false;
        }
      }
      notify(
        chainValidMessage || {
          title: "Great!",
          message: "All the blocks in this chain are valid."
        }
      );
      return true;
    };

    _this.deleteBlock = function(index) {
      var _this$props4 = _this.props,
        chain = _this$props4.chain,
        updateChain = _this$props4.updateChain;

      var filteredChain = chain.filter(function(block) {
        return block.index !== index;
      });
      updateChain(filteredChain);
    };

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
        this.addBlock();
      }
    },
    {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(nextProps) {
        var difficulty = nextProps.difficulty;

        if (difficulty && difficulty !== this.state.difficulty) {
          this.setState({
            difficulty: difficulty
          });
        }
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

Blockchain.propTypes = {};

exports.default = Blockchain;
