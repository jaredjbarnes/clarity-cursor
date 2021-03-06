/** @jest-environment node */
import { RegexValue } from "../index";

test("RegexValue: exec.", () => {
  const notA = new RegexValue("not-a", "[^a]+");

  const result = notA.exec("John");
  const result2 = notA.exec("a");

  const expectedValue = {
    children: [],
    value: "John",
    type: "regex-value",
    name: "not-a",
    startIndex: 0,
    endIndex: 3,
    isComposite: false,
  };

  expect(JSON.stringify(result)).toBe(JSON.stringify(expectedValue));
  expect(result2).toBe(null);
});
