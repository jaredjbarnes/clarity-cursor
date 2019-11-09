"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CompositePattern2 = _interopRequireDefault(require("./CompositePattern.js"));

var _CompositeNode = _interopRequireDefault(require("../../ast/CompositeNode.js"));

var _OptionalComposite = _interopRequireDefault(require("./OptionalComposite.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RepeatComposite =
/*#__PURE__*/
function (_CompositePattern) {
  _inherits(RepeatComposite, _CompositePattern);

  function RepeatComposite(name, pattern) {
    var _this;

    _classCallCheck(this, RepeatComposite);

    _this.name = name;
    _this.pattern = pattern;
    _this.patterns = [pattern];

    _this.assertArguments();

    _this.reset();

    return _possibleConstructorReturn(_this);
  }

  _createClass(RepeatComposite, [{
    key: "assertArguments",
    value: function assertArguments() {
      if (!(this.pattern instanceof Pattern)) {
        throw new Error("Invalid Argument: The pattern needs to be an instance of Pattern.");
      }

      if (this.pattern instanceof _OptionalComposite.default) {
        throw new Error("Invalid Argument: Cannot use an OptionalComposite within a RepeatComposite.");
      }

      if (typeof this.name !== "string") {
        throw new Error("Invalid Argument: RepeatComposite needs to have a name that's a string.");
      }
    }
  }, {
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
        try {
          this.nodes.push(this.pattern.parse(this.cursor));
        } catch (error) {
          break;
        }
      }

      this.processValue();
    }
  }, {
    key: "processValue",
    value: function processValue() {
      if (this.nodes.length === 0) {
        throw new ParseError("Couldn't find the ".concat(this.pattern.getName(), " pattern."), this.mark.index, this);
      }

      this.nodes = this.nodes.filter(function (node) {
        return node != null;
      });
      this.node = new _CompositeNode.default(this.name, this.nodes[0].startIndex, this.nodes[this.nodes.length - 1].endIndex);
      this.node.children = this.nodes;
    }
  }, {
    key: "getPatterns",
    value: function getPatterns() {
      return this.patterns;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new RepeatComposite(this.name, this.patterns);
    }
  }]);

  return RepeatComposite;
}(_CompositePattern2.default);

exports.default = RepeatComposite;
//# sourceMappingURL=RepeatComposite.js.map