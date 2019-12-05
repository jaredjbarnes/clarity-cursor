import Pattern from "./Pattern.js";
import ParserError from "./ParseError.js";

export default class RecursivePattern extends Pattern {
  constructor(name) {
    super(name);
  }

  getPattern() {
    return this._climb(this.parent, pattern => {
      return pattern.name === this.name;
    });
  }

  _climb(pattern, isMatch) {
    if (isMatch(pattern)) {
      return pattern;
    } else {
      if (pattern.parent != null) {
        return this._climb(pattern.parent, isMatch);
      }
      return null;
    }
  }

  parse(cursor) {
    if (this.pattern == null) {
      const pattern = this.getPattern();

      if (pattern == null) {
        cursor.throwError(
          new ParserError(
            `Couldn't find parent pattern to recursively parse, with the name ${this.name}.`
          ),
          cursor.index,
          this
        );
        return null;
      }

      this.pattern = pattern.clone();
      this.pattern.parent = this;
    }

    return this.pattern.parse(cursor);
  }

  clone(name) {
    if (typeof name !== "string") {
      name = this.name;
    }
    return new RecursivePattern(name);
  }

  getCurrentMark() {
    return this.pattern.getCurrentMark();
  }
}
