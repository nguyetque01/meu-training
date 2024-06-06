import React from "react";

import { IProductDto } from "../types/product.tying";

export const shouldHighlight = (
  product: IProductDto,
  column: string,
  searchColumn: string
) => {
  var isMatchColumn = product.searchMatches.hasOwnProperty(column);
  return searchColumn === "all" || isMatchColumn;
};

export const highlightText = (
  text: string,
  matches: number[],
  searchTerm: string,
  searchType: string
) => {
  if (!matches || matches.length === 0) {
    return text;
  }

  let highlightedText = text;

  if (searchType === "exact") {
    const words = highlightedText.split(" ");

    matches.forEach((index) => {
      let start = 0;
      if (index > 0) {
        start = words
          .slice(0, index)
          .reduce((acc, word) => acc + word.length + 1, 0);
      }

      const end = start + searchTerm.length;

      if (start >= 0 && end <= text.length) {
        const word = text.substring(start, end);
        highlightedText = highlightedText.replace(
          new RegExp(escapeRegExp(word), "g"),
          highlight(word)
        );
      }
    });
  } else {
    highlightedText = highlightedText.replace(
      new RegExp(escapeRegExp(searchTerm), "gi"),
      (match) => highlight(match)
    );
  }

  return React.createElement("span", {
    dangerouslySetInnerHTML: { __html: highlightedText },
  });
};

const highlight = (word: string) =>
  `<span style="background-color: yellow;">${word}</span>`;

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
