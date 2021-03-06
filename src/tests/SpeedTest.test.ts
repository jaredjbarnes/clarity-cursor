/** @jest-environment node */
import unit from "./javascriptPatterns/unit";
import Cursor from "../Cursor";

const unitRegex = /(\\d*\\.?\\d+)\\s?(px|em|ex|%|in|cn|mm|pt|pc+)/gim;

test("SpeedTest: unit", () => {
  const simpleUnit = "12px";
  const cursor = new Cursor(simpleUnit);

  const regexBeginTime = Date.now();

  for (let x = 0; x < 100000; x++) {
    unitRegex.lastIndex = 0;
    unitRegex.exec(simpleUnit);
  }

  const RegexEndTime = Date.now();
  const regexDuration = RegexEndTime - regexBeginTime;

  const cpBeginTime = Date.now();
  for (let x = 0; x < 100000; x++) {
    cursor.index = 0;
    unit.parse(cursor);
  }
  const cpEndTime = Date.now();
  const cpDuration = cpEndTime - cpBeginTime;

  // We need another runner that shows this value. Just not in tests.
  // console.log(regexDuration, cpDuration);
});
