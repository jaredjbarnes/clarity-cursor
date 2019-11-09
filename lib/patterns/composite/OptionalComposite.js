"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _CompositePattern = _interopRequireDefault(require("./CompositePattern.js"));

var _Pattern2 = _interopRequireDefault(require("../Pattern.js"));

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

var OptionalComposite =
/*#__PURE__*/
function (_Pattern) {
  _inherits(OptionalComposite, _Pattern);

  function OptionalComposite(pattern) {
    var _this;

    _classCallCheck(this, OptionalComposite);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(OptionalComposite).call(this));
    _this.pattern = pattern;

    _this.assertArguments();

    return _this;
  }

  _createClass(OptionalComposite, [{
    key: "assertArguments",
    value: function assertArguments() {
      if (!(this.pattern instanceof _CompositePattern.default)) {
        throw new Error("Invalid Arguments: Expected a CompositePattern.");
      }
    }
  }, {
    key: "getType",
    value: function getType() {
      return this.pattern.getType();
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.pattern.getName();
    }
  }, {
    key: "getPatterns",
    value: function getPatterns() {
      return this.pattern.getPatterns();
    }
  }, {
    key: "parse",
    value: function parse(cursor) {
      var mark = cursor.mark();

      try {
        return this.pattern.parse(cursor);
      } catch (error) {
        cursor.moveToMark(mark);
        return null;
      }
    }
  }, {
    key: "clone",
    value: function clone() {
      return new OptionalComposite(this.pattern);
    }
  }]);

  return OptionalComposite;
}(_Pattern2.default);

exports.default = OptionalComposite;
//# sourceMappingURL=OptionalComposite.js.map