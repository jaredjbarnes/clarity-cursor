import ValuePattern from "./ValuePattern";
import ValueNode from "../../ast/ValueNode";
import ParseError from "../ParseError.js";

export default class NotValue extends ValuePattern {
  constructor(name, pattern) {
    super();
    this.name = name;
    this.pattern = pattern.clone();
    this.patterns = [pattern];

    this.assertArguments();
    this.reset();
  }

  assertArguments() {
    if (!(this.pattern instanceof ValuePattern)) {
      throw new Error(
        "Invalid Arguments: Expected the pattern to be a ValuePattern."
      );
    }

    if (typeof this.name !== "string") {
      throw new Error("Invalid Arguments: Expected name to be a string.");
    }
  }

  reset(cursor) {
    this.cursor = null;
    this.mark = null;
    this.match = "";
    this.node = null;

    if (cursor != null) {
      this.cursor = cursor;
      this.mark = this.cursor.mark();
    }
  }

  parse(cursor) {
    this.reset(cursor);
    this.tryPattern();

    return this.node;
  }

  tryPattern() {
    while (true) {
      const mark = this.cursor.mark();

      try {
        this.pattern.parse(this.cursor);
        this.cursor.moveToMark(mark);
        break;
      } catch (error) {
        this.cursor.moveToMark(mark);
        this.match += this.cursor.getChar();

        if (this.cursor.hasNext()) {
          this.cursor.next();
        } else {
          break;
        }
      }
    }

    this.processMatch();
  }

  processMatch() {
    if (this.match.length === 0) {
      throw new ParseError(``);
    } else {
      this.node = new ValueNode(
        this.name,
        this.match,
        this.mark.index,
        this.match.length - 1
      );
    }
  }

  getName() {
    return this.name;
  }

  getPatterns() {
    return this.patterns;
  }

  getValue() {
    return null;
  }

  clone() {
    return new NotValue(this.name, this.pattern);
  }
}
