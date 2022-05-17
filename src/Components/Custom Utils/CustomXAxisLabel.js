import React from "react";
import { useColorMode } from "@chakra-ui/react";

import { ReachContext } from "../RunTurf";

export default function CustomizedTick(props) {
  const { x, y, stroke, payload } = props;
  const { colorMode } = useColorMode();

  // let fitLargerValues = payload.value.match(/(.*?\s){1}/g);
  // let fitSmallestValues = payload.value.match(/(.*?\s){3}/g);
  // let fitMediumValues = payload.value.match(/(.*?\s){2}/g);
  let test = payload.value.match(/\b[\w']+(?:[^\w\n]+[\w']+){0,1}\b/g);
  console.log(test);
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={5}
        y={0}
        style={{ fill: colorMode === "dark" ? "#FFFFFF" : "#1A202C" }}
      >
        {test.map((txt, i) => (
          <tspan textAnchor={"middle"} x={2} dy={20}>
            {txt}
          </tspan>
        ))}
      </text>
    </g>
  );
}
