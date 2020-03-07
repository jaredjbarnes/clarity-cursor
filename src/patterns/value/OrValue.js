import ValuePattern from "./ValuePattern.js";
import ValueNode from "../../ast/ValueNode.js";
import OptionalValue from "./OptionalValue.js";
import Pattern from "../Pattern.js";

export default class OrValue extends ValuePattern {
  constructor(name, patterns) {
    super("or-value", name, patterns);
    this._assertArguments();
  }

  _assertArguments() {
    if (this._children.length < 2) {
      throw new Error(
        "Invalid Argument: OrValue needs to have more than one value pattern."
      );
    }

    const hasOptionalChildren = this._children.some(
      pattern => pattern instanceof OptionalValue
    );

    if (hasOptionalChildren) {
      throw new Error("OrValues cannot have optional values.");
    }
  }

  _reset(cursor) {
    this.index = 0;
    this.errors = [];
    this.node = null;
    this.cursor = cursor;
    this.mark = cursor.mark();
  }

  parse(cursor) {
    this._reset(cursor);
    this._tryPattern();

    return this.node;
  }

  _tryPattern() {
    while (true) {
      const pattern = this._children[this.index];
      const node = pattern.parse(this.cursor, this.parseError);

      if (this.cursor.hasUnresolvedError()) {
        if (this.index + 1 < this._children.length) {
          this.cursor.resolveError();
          this.index++;
          this.cursor.moveToMark(this.mark);
        } else {
          this.node = null;
          break;
        }
      } else {
        this.node = new ValueNode(
          "or-value",
          this.name,
          node.value,
          node.startIndex,
          node.endIndex
        );

        this.cursor.index = this.node.endIndex;
        this.cursor.addMatch(this, this.node);

        break;
      }
    }
  }

  clone(name) {
    if (typeof name !== "string") {
      name = this.name;
    }
    return new OrValue(name, this._children);
  }

  getPossibilities(rootPattern) {
    if (rootPattern == null || !(rootPattern instanceof Pattern)) {
      rootPattern = this;
    }

    return this.children
      .map(child => {
        return child.getPossibilities(rootPattern);
      })
      .reduce((acc, value) => {
        return acc.concat(value);
      }, []);
  }
}
