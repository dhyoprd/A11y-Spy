import type { Position, Range } from "../core/types";

export function offsetToPosition(text: string, offset: number): Position {
  let line = 0;
  let lineStartOffset = 0;

  for (let index = 0; index < offset; index += 1) {
    if (text.charCodeAt(index) === 10) {
      line += 1;
      lineStartOffset = index + 1;
    }
  }

  return {
    line,
    character: offset - lineStartOffset
  };
}

export function offsetsToRange(text: string, startOffset: number, endOffset: number): Range {
  return {
    start: offsetToPosition(text, startOffset),
    end: offsetToPosition(text, endOffset)
  };
}
