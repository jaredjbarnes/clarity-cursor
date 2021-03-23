import Cursor from "./Cursor";
import Pattern from "./patterns/Pattern";

export default class TextInspector {
  public cursor: any;
  public result: any;
  public text: any;
  public match: any;
  public error: any;
  public patternMatch: any;
  public matchedText: any;
  public rootPattern: any;
  public tokens: any;
  public options: any;
  public parseStack: any;

  constructor() {
    this.cursor = null;
    this.result = null;
    this.text = null;
    this.match = null;
    this.error = null;
    this.patternMatch = null;
    this.matchedText = "";
    this.rootPattern = null;
    this.tokens = null;
    this.options = [];
    this.parseStack = [];
  }

  inspect(text: string, pattern: Pattern) {
    this.reset();

    this.text = text;
    this.rootPattern = pattern;

    // If no text all options are available.
    if (text.length === 0) {
      return {
        pattern: null,
        astNode: null,
        match: null,
        error: null,
        tokens: {
          startIndex: 0,
          options: pattern.getTokens(),
        },
        isComplete: false,
        parseStack: [],
      };
    }

    this.parse();
    this.saveParseStack();
    this.saveMatchedText();
    this.saveMatch();
    this.saveError();
    this.saveOptions();
    this.saveNextToken();

    return {
      pattern: this.patternMatch.pattern,
      astNode: this.patternMatch.astNode,
      match: this.match,
      error: this.error,
      tokens: this.tokens,
      isComplete: this.cursor.didSuccessfullyParse(),
      parseStack: this.parseStack,
    };
  }

  private reset() {
    this.cursor = null;
    this.result = null;
    this.text = null;
    this.match = null;
    this.error = null;
    this.patternMatch = null;
    this.matchedText = "";
    this.rootPattern = null;
    this.tokens = null;
    this.options = [];
    this.parseStack = [];
  }

  private parse() {
    this.rootPattern = this.rootPattern;
    this.cursor = new Cursor(this.text);
    this.cursor.startRecording();
    this.result = this.rootPattern.parse(this.cursor);
    this.patternMatch = this.cursor.lastMatch;
  }

  private saveParseStack() {
    this.parseStack = this.cursor.history.getLastParseStack();
  }

  private saveMatchedText() {
    if (this.patternMatch.astNode != null) {
      this.matchedText = this.text.substring(
        0,
        this.patternMatch.astNode.endIndex + 1
      );
    }
  }

  private saveMatch() {
    const node = this.patternMatch.astNode;

    if (node == null) {
      this.match = null;
      return;
    }

    let endIndex = this.matchedText.length - 1;

    this.match = {
      text: this.matchedText,
      startIndex: 0,
      endIndex: endIndex,
    };
  }

  private saveError() {
    if (this.patternMatch.astNode == null) {
      this.error = {
        startIndex: 0,
        endIndex: this.text.length - 1,
        text: this.text,
      };
      return this;
    }

    if (this.text.length > this.matchedText.length) {
      const difference = this.text.length - this.matchedText.length;
      const startIndex = this.patternMatch.astNode.endIndex + 1;
      const endIndex = startIndex + difference - 1;

      this.error = {
        startIndex: startIndex,
        endIndex: endIndex,
        text: this.text.substring(startIndex, endIndex + 1),
      };

      return;
    } else {
      this.error = null;
      return;
    }
  }

  private saveNextToken() {
    if (
      this.patternMatch.pattern === this.rootPattern &&
      this.cursor.didSuccessfullyParse()
    ) {
      this.tokens = null;
      return;
    }

    if (this.patternMatch.astNode == null) {
      let options = this.rootPattern.getTokens();
      const parts = this.text.split(" ").filter((part: any) => {
        return part.length > 0;
      });

      options = options.filter((option: any) => {
        return parts.some((part: any) => {
          return option.indexOf(part) > -1;
        });
      });

      if (options.length === 0) {
        this.tokens = null;
        return;
      }

      this.tokens = {
        startIndex: 0,
        options,
      };

      return;
    }

    const options = this.options;
    let startIndex = this.matchedText.length;

    if (this.matchedText.length < this.text.length) {
      const leftOver = this.text.substring(this.matchedText.length);
      const partialMatchOptions = options
        .filter((option: any) => {
          return option.indexOf(leftOver) === 0;
        })
        .map((option: any) => {
          return option.substring(leftOver.length);
        });

      if (partialMatchOptions.length === 0) {
        this.tokens = null;
        return;
      } else {
        this.match = {
          ...this.match,
          text: this.match.text + leftOver,
          endIndex: this.match.endIndex + leftOver.length,
        };

        this.error = null;

        this.tokens = {
          startIndex: this.match.endIndex + 1,
          options: partialMatchOptions,
        };

        return;
      }
    }

    this.tokens = {
      startIndex,
      options,
    };
  }

  private saveOptions() {
    const furthestMatches = this.cursor.history.astNodes.reduce(
      (acc: any, node: any, index: any) => {
        if (node.endIndex === acc.furthestTextIndex) {
          acc.nodeIndexes.push(index);
        } else if (node.endIndex > acc.furthestTextIndex) {
          acc.furthestTextIndex = node.endIndex;
          acc.nodeIndexes = [index];
        }

        return acc;
      },
      { furthestTextIndex: -1, nodeIndexes: [] }
    );

    const matches = furthestMatches.nodeIndexes.reduce(
      (acc: any, index: any) => {
        const pattern = this.cursor.history.patterns[index];
        const tokens = pattern.getNextTokens();

        tokens.forEach((token: any) => {
          acc[token] = true;
        });

        return acc;
      },
      {}
    );

    this.options = Object.keys(matches);
  }

  static inspect(text: string, pattern: Pattern) {
    return new TextInspector().inspect(text, pattern);
  }
}
