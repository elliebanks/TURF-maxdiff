import React from "react";
import { Box, Container, HStack, useColorMode } from "@chakra-ui/react";

import { ReachContext } from "../RunTurf";

export default function CustomizedTick(props) {
  const { x, y, stroke, payload } = props;
  const maxLen = 10;

  // function shorten(payload, maxLen, separator = " ") {
  //   if (payload.value.length <= maxLen) return payload.value;
  //   return payload.value.substr(
  //     0,
  //     payload.value.lastIndexOf(separator, maxLen)
  //   );
  // }

  // let yourString = "The quick brown fox jumps over the lazy dog"; //replace with your string.
  let maxLength = 10; // maximum number of characters to extract

  let skippedSpaces = payload.value.substring(
    0,
    payload.value.lastIndexOf(" ")
  );
  console.log(skippedSpaces);

  //trim the string to the maximum length
  let trimmedString = payload.value.substr(0, payload.value.lastIndexOf(" "));
  console.log(trimmedString);

  //re-trim if we are in the middle of a word
  let trimmedString2 = trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
  );

  console.log(trimmedString2);

  function splitNChars(txt, num) {
    let result = [];
    for (let i = 0; i < txt.length; i += num) {
      result.push(txt.substr(i, num));
    }
    return result;
  }

  console.log(payload);

  let fitLargerValues = payload.value.match(/(.*?\s){1}/g);
  let fitSmallestValues = payload.value.match(/(.*?\s){3}/g);
  let fitMediumValues = payload.value.match(/(.*?\s){2}/g);
  let test = payload.value.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,1}\b/g);
  console.log(test);

  // const formatter = (payload) => {
  //   const line1 = 12;
  //
  //   if (payload?.value?.length > 12) {
  //     return `${payload?.value?.substring(0, 20)}`;
  //   }
  // };
  const line1 = payload.value
    .split(" ")
    .map((value) => <tspan>{value.split}</tspan>);

  const line2 = payload.value
    .split(" ")
    .map((value) => <tspan>{value.split}</tspan>);

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} fill="#ccc">
        {}
        {fitLargerValues.map((txt, i) => (
          <tspan textAnchor={"middle"} x={0} dy={20}>
            {txt}
          </tspan>
        ))}
      </text>
    </g>
  );
}
