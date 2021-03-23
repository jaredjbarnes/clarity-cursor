import RepeatValue from "../patterns/value/RepeatValue";
import Literal from "../patterns/value/Literal";
import OptionalValue from "../patterns/value/OptionalValue";
import assert from "assert";
import Cursor from "../Cursor";

exports["RepeatValue: Empty Constructor."] = () => {
  assert.throws(() => {
    new RepeatValue();
  });
};

exports["RepeatValue: Invalid name."] = () => {
  assert.throws(() => {
    new RepeatValue([], new Literal("blah", "Blah"));
  });
};

exports["RepeatValue: No patterns"] = () => {
  assert.throws(() => {
    new RepeatValue("and-value");
  });
};

exports["RepeatValue: Empty patterns"] = () => {
  assert.throws(() => {
    new RepeatValue("and-value", null);
  });
};

exports["RepeatValue: Invalid patterns"] = () => {
  assert.throws(() => {
    new RepeatValue("and-value", {});
  });
};

exports["RepeatValue: No Match"] = () => {
  const john = new Literal("john", "John");
  const johns = new RepeatValue("johns", john);
  const cursor = new Cursor("JaneJane");

  johns.parse(cursor);
  assert.equal(cursor.hasUnresolvedError(), true);
};

exports["RepeatValue: Success, one John"] = () => {
  const john = new Literal("john", "John");
  const johns = new RepeatValue("johns", john);
  const cursor = new Cursor("John");
  const node = johns.parse(cursor);

  assert.equal(node.name, "johns");
  assert.equal(node.value, "John");
  assert.equal(node.startIndex, 0);
  assert.equal(node.endIndex, 3);
};

exports["RepeatValue: Success with a terminating match."] = () => {
  const john = new Literal("john", "John");
  const johns = new RepeatValue("johns", john);
  const cursor = new Cursor("JohnJohnJane");
  const node = johns.parse(cursor);

  assert.equal(node.name, "johns");
  assert.equal(node.value, "JohnJohn");
  assert.equal(node.startIndex, 0);
  assert.equal(node.endIndex, 7);
  assert.equal(cursor.getIndex(), 7);
};

exports["RepeatValue: Bad cursor."] = () => {
  const john = new Literal("john", "John");
  const johns = new RepeatValue("johns", john);

  assert.throws(() => {
    johns.parse(cursor);
  });
};

exports["RepeatValue: Clone."] = () => {
  const john = new Literal("john", "John");
  const johns = new RepeatValue("johns", john);
  const clone = johns.clone();

  assert.equal(johns.name, clone.name);
};

exports["RepeatValue: Try Optional."] = () => {
  const john = new Literal("john", "John");

  assert.throws(() => {
    new RepeatValue("johns", new OptionalValue(john));
  });
};

exports["RepeatValue: With divider."] = () => {
  const cursor = new Cursor("John,John");
  const john = new Literal("john", "John");
  const divider = new Literal("divider", ",");

  const node = new RepeatValue("johns", john, divider).parse(cursor);

  assert.equal(node.name, "johns");
  assert.equal(node.value, "John,John");
};