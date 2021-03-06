/** @jest-environment node */
import CursorHistory from "../CursorHistory";
import { Literal, ValueNode, Cursor, ParseError } from "../index";
import sentence from "./patterns/sentence";
describe("CursorHistory", () => {
  test("addMatch", () => {
    const cursorHistory = new CursorHistory();
    const pattern = new Literal("T", "T");
    const node = new ValueNode("T", "T", "T", 0, 1);

    cursorHistory.addMatch(pattern, node);
    expect(cursorHistory.getFurthestMatch().pattern).toBe(pattern);
    expect(cursorHistory.getFurthestMatch().astNode).toBe(node);
  });

  test("addMatch with Recording", () => {
    const cursorHistory = new CursorHistory();
    const pattern = new Literal("T", "T");
    const node = new ValueNode("T", "T", "T", 0, 1);

    cursorHistory.startRecording();
    cursorHistory.addMatch(pattern, node);

    expect(cursorHistory.getFurthestMatch().pattern).toBe(pattern);
    expect(cursorHistory.getFurthestMatch().astNode).toBe(node);
    expect(cursorHistory.getLastMatch().pattern).toBe(pattern);
    expect(cursorHistory.getLastMatch().astNode).toBe(node);
  });

  test("addError", () => {
    const cursorHistory = new CursorHistory();
    const error = new ParseError(
      "Expected something else.",
      0,
      new Literal("T", "T")
    );

    cursorHistory.addError(error);

    expect(cursorHistory.getFurthestError()).toBe(error);
  });

  test("addError with recording", () => {
    const cursorHistory = new CursorHistory();
    const error = new ParseError(
      "Expected something else.",
      0,
      new Literal("T", "T")
    );

    cursorHistory.startRecording();
    cursorHistory.addError(error);

    expect(cursorHistory.getFurthestError()).toBe(error);
    expect(cursorHistory.getLastError()).toBe(error);
  });

  test("getLastError without any.", () => {
    const cursorHistory = new CursorHistory();
    expect(cursorHistory.getLastError()).toBe(null);
  });

  test("getFurthestMatch without an matches.", () => {
    const cursorHistory = new CursorHistory();

    expect(cursorHistory.getLastMatch().pattern).toBe(null);
    expect(cursorHistory.getLastMatch().astNode).toBe(null);
    expect(cursorHistory.getFurthestMatch().pattern).toBe(null);
    expect(cursorHistory.getFurthestMatch().astNode).toBe(null);
  });

  test("getFurthestMatch without an matches while recording.", () => {
    const cursorHistory = new CursorHistory();
    cursorHistory.startRecording();

    expect(cursorHistory.getLastMatch().pattern).toBe(null);
    expect(cursorHistory.getLastMatch().astNode).toBe(null);
    expect(cursorHistory.getFurthestMatch().pattern).toBe(null);
    expect(cursorHistory.getFurthestMatch().astNode).toBe(null);
  });

  test("getAllParseStacks.", () => {
    const text = "Pat went to the";
    const cursor = new Cursor(text);
    cursor.startRecording();

    sentence.parse(cursor);
    cursor.history.getAllParseStacks();
  });

  test("getLastParseStack.", () => {
    const text = "Pat went to the";
    const cursor = new Cursor(text);
    cursor.startRecording();

    sentence.parse(cursor);

    const stack = cursor.history.getLastParseStack();

    expect(stack.length).toBe(5);
    expect(stack[0].name).toBe("pat");
    expect(stack[1].name).toBe("space");
    expect(stack[2].name).toBe("went-to");
    expect(stack[3].name).toBe("space");
    expect(stack[4].name).toBe("the");
  });
});
