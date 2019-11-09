"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CompositePatterns2 = _interopRequireDefault(require("./CompositePatterns.js"));

var _CompositeNode = _interopRequireDefault(require("../../ast/CompositeNode.js"));

var _StackInformation = _interopRequireDefault(require("../StackInformation.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var OrComposite =
/*#__PURE__*/
function (_CompositePatterns) {
  _inherits(OrComposite, _CompositePatterns);

  function OrComposite() {
    _classCallCheck(this, OrComposite);

    return _possibleConstructorReturn(this, _getPrototypeOf(OrComposite).apply(this, arguments));
  }

  _createClass(OrComposite, [{
    key: "reset",
    value: function reset(cursor) {
      this.cursor = null;
      this.index = 0;
      this.nodes = [];
      this.node = null;

      if (cursor != null) {
        this.cursor = cursor;
        this.mark = this.cursor.mark();
      }
    }
  }, {
    key: "parse",
    value: function parse(cursor) {
      this.reset(cursor);
      this.tryPattern();
      return this.node;
    }
  }, {
    key: "tryPattern",
    value: function tryPattern() {
      while (true) {
        var mark = this.cursor.mark();

        try {
          var result = this.patterns[this.index].parse(this.cursor);
          this.node = new _CompositeNode.default(this.name, result.startIndex, result.endIndex);
          this.node.children.push(result);
          break;
        } catch (error) {
          if (this.index + 1 < this.patterns.length) {
            this.cursor.moveToMark(mark);
            this.index++;
          } else {
            error.stack.push(new _StackInformation.default(this.mark, this));
            throw error;
          }
        }
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new OrComposite(this.name, this.patterns);
    }
  }]);

  return OrComposite;
}(_CompositePatterns2.default);

exports.default = OrComposite;
//# sourceMappingURL=OrComposite.js.map