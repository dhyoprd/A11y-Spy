export type ImageAttributeValue = {
  kind: "empty" | "string";
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
