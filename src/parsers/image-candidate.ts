export type ImageAttributeValue =
  | {
      kind: "empty";
      value: "";
    }
  | {
      kind: "string";
      value: string;
    }
  | {
      kind: "boolean";
      value: boolean;
    }
  | {
      kind: "expression";
      value: string;
    };

export type ImageAttribute = {
  name: string;
  value: ImageAttributeValue;
};

export type ImageElementCandidate = {
  attributes: ImageAttribute[];
  hasSpreadAttribute?: boolean;
  tagNameStartOffset: number;
  tagNameEndOffset: number;
};
