import Literal from "../patterns/Literal.js";
import Or from "../patterns/Or.js";
import And from "../patterns/And.js";
import Not from "../patterns/Not.js";
import Cursor from "../Cursor.js";
import Repeat from "../patterns/Repeat.js";
import OneOf from "../patterns/OneOf.js";
import Any from "../patterns/Any.js";
import assert from "assert";

exports["Whitespace."] = () => {
  const space = new Literal("space", " ");
  const carriageReturn = new Literal("carriage-return", "\r");
  const newLine = new Literal("new-line", "\n");
  const tab = new Literal("tab", "\t");
  const doubleSlash = new Literal("double-slash", "//");
  const slashStar = new Literal("slash-star", "/*");
  const starSlash = new Literal("star-slash", "*/");

  const lineEnd = new Or([carriageReturn, newLine]);
  const anyCharacterButLineEnd = new Not("comment", lineEnd);
  const anyCharacterButStarSlash = new Not("comment", starSlash);

  const singleLineComment = new And("single-line-comment", [
    doubleSlash,
    anyCharacterButLineEnd,
    lineEnd
  ]);

  const multilineComment = new And("multiline-comment", [
    slashStar,
    anyCharacterButStarSlash,
    starSlash
  ]);

  const whitespaceOptions = new Or([
    space,
    lineEnd,
    tab,
    singleLineComment,
    multilineComment
  ]);

  const whitespace = new Repeat("whitespace", whitespaceOptions);

  const cursor = new Cursor(`
            //This is a single line comment!

            /*
                First line!
                Second line!
            */
        `);

  const node = whitespace.parse(cursor);
};

exports["Method Invocation."] = () => {
  const number = new OneOf("number", "0123456789");
  const openParen = new Literal("openParen", "(");
  const closeParen = new Literal("closeParen", ")");
  const letter = new OneOf(
    "letter",
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  );
  const dash = new Literal("dash", "-");
  const underscore = new Literal("underscore", "_");
  const acceptableCharacters = new Any("letter-number-dash-underscore", [
    letter,
    number,
    dash,
    underscore
  ]);

  const identifier = new And(
    "identifier",
    [letter, acceptableCharacters],
    true
  );

  const comma = new Literal("comma", ",");
  const space = new Literal("space", " ");
  const spaces = new Repeat("spaces", space);
  const surroundWithSpace = new And(" , ", [spaces, comma, spaces]);
  const beginWithSpace = new And(" ,", [spaces, comma]);
  const endWithSpace = new And(", ", [comma, spaces]);

  const divider = new Any("comma", [
    comma,
    surroundWithSpace,
    beginWithSpace,
    endWithSpace
  ]);

  const notADivider = new Not("argument", divider);
  const args = new Repeat("arguments", notADivider, divider);
  const methodSignature = new And("method-signature", [
    identifier,
    openParen,
    closeParen
  ]);

  const cursor = new Cursor("methodName()");
  const node = methodSignature.parse(cursor);
};
