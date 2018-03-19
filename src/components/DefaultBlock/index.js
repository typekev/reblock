"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var DefaultBlock = function DefaultBlock(props) {
  return _react2.default.createElement("div", null, JSON.stringify(props));
};

DefaultBlock.propTypes = {};

exports.default = DefaultBlock;
