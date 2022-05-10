import React from "react";

import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryGroup,
  VictoryZoomContainer,
  VictoryTheme,
} from "victory";
import { useColorMode } from "@chakra-ui/react";
import { ReachContext } from "./RunTurf";
import { SelectedSubgroupContext } from "./TURFpage";

const TURFChart = () => {
  const { colorMode } = useColorMode();

  const { orderOfItems, incrementalReachSummary } =
    React.useContext(ReachContext);

  const { numberOfSubgroupRespondents, selectedSubgroup } = React.useContext(
    SelectedSubgroupContext
  );

  const data = React.useMemo(() => {
    return orderOfItems?.map((claim, i) => ({
      // Item: i + 1,
      Claim: claim.split(" ").join("\n"),
      Reach: (
        incrementalReachSummary[claim]?.Summary_Metrics.Reach * 100
      ).toFixed(1),
    }));
  }, [orderOfItems, incrementalReachSummary]);
  console.log(data);

  return (
    <VictoryChart domainPadding={6} theme={VictoryTheme.material}>
      <VictoryAxis
        dependentAxis
        style={{
          grid: { stroke: "rgba(0,0,0,.03)" },
          axisLabel: { fontSize: 6, padding: 30, fill: "#ccc" },
          axis: { stroke: "#ccc" },
          ticks: { stroke: "#ccc", size: 5 },
          tickLabels: { fontSize: 6, padding: 5, fill: "#999" },
        }}
      />
      <VictoryAxis
        style={{
          grid: { stroke: "rgba(0,0,0,.03)" },
          axisLabel: { fontSize: 6, padding: 30, fill: "#ccc" },
          axis: { stroke: "#ccc" },
          ticks: { stroke: "#ccc", size: 5 },
          tickLabels: { fontSize: 6, padding: 5, fill: "#999" },
        }}
      />
      <VictoryScatter
        data={data}
        x={"Claim"}
        y={"Reach"}
        labels={({ data }) => `y: ${data.y}`}
        size={2}
        style={{
          data: {
            fill: "#fff",
            fillOpacity: 1,
            stroke: "#999",
            strokeWidth: 2,
          },
        }}
      />
    </VictoryChart>
    // <VictoryChart
    //   domainPadding={2}
    //   padding={{ left: 90, top: 40, bottom: 150, right: 90 }}
    //   containerComponent={
    //     <VictoryVoronoiContainer
    //       voronoiDimension="x"
    //       labels={({ datum }) => `y: ${datum.y}`}
    //     />
    //   }
    // >
    //   <VictoryAxis
    //     dependentAxis
    //     tickFormat={(t) => `${t} %`}
    //     style={{
    //       grid: { stroke: "rgba(0,0,0,.03)" },
    //       axisLabel: { fontSize: 18, padding: 30, fill: "#ccc" },
    //       axis: { stroke: "#ccc" },
    //       ticks: { stroke: "#ccc", size: 5 },
    //       tickLabels: { fontSize: 6, padding: 5, fill: "#999" },
    //     }}
    //   />
    //   <VictoryAxis
    //     style={{
    //       grid: { stroke: "rgba(0,0,0,.03)" },
    //       axisLabel: { fontSize: 6, padding: 30, fill: "#ccc" },
    //       axis: { stroke: "#ccc" },
    //       ticks: { stroke: "#ccc", size: 5 },
    //       tickLabels: { fontSize: 4, padding: 5, fill: "#999" },
    //     }}
    //   />
    //   <VictoryLine
    //     data={data}
    //     y={"Reach"}
    //     x={"Claim"}
    //     labels={({ datum }) => datum.x}
    //     // labelComponent={<VictoryTooltip />}
    //     style={{
    //       data: { stroke: "#ccc", strokeWidth: 1 },
    //     }}
    //   />
    // </VictoryChart>
  );
};
//     <VictoryChart
//       domainPadding={6}
//       // domain={{ y: [0, 100] }}
//       padding={{ left: 90, top: 40, bottom: 150, right: 90 }}
//     >
//       {/* reach/left axis */}
//       <VictoryAxis
//         dependentAxis
//         style={{
//           grid: { stroke: "rgba(0,0,0,.03)" },
//           axisLabel: { fontSize: 18, padding: 30, fill: "#ccc" },
//           axis: { stroke: "#ccc" },
//           ticks: { stroke: "#ccc", size: 5 },
//           tickLabels: { fontSize: 6, padding: 5, fill: "#999" },
//         }}
//       />
//
//       {/* bottom axis */}
//       <VictoryAxis
//         style={{
//           grid: { stroke: "rgba(0,0,0,.03)" },
//           axisLabel: { fontSize: 18, padding: 30, fill: "#ccc" },
//           axis: { stroke: "#ccc" },
//           ticks: { stroke: "#ccc", size: 5 },
//           tickLabels: { fontSize: 4, padding: 5, fill: "#999" },
//         }}
//       />
//       <VictoryGroup
//         data={data}
//         y="Reach"
//         x="Claim"
//         style={{
//           labels: { fontSize: 12 },
//         }}
//         labelComponent={
//           <VictoryTooltip
//             cornerRadius={2}
//             pointerLength={5}
//             flyoutStyle={{
//               stroke: "#ccc",
//               fill: "#eee",
//             }}
//             style={{ fontSize: 22, fill: "#555", padding: 10 }}
//           />
//         }
//       >
//         <VictoryLine
//           interpolation="monotoneX"
//           style={{
//             data: { stroke: "#ccc", strokeWidth: 3 },
//           }}
//         />
//         <VictoryScatter
//           size={3}
//           style={{
//             data: {
//               fill: "#fff",
//               fillOpacity: 1,
//               stroke: "#999",
//               strokeWidth: 2,
//             },
//           }}
//         />
//       </VictoryGroup>
//     </VictoryChart>
//   );
// };

export default TURFChart;

// const axisStyle = {
//   // axis: { stroke: "#5a6480" },
//   grid: { stroke: "#5a6480" },
//   tickLabels: { fontSize: 4 },
//   axisLabel: { padding: 30 },
// };

// const startReach = 100;
// const endReach = 0;
{
  /*<VictoryGroup*/
}
{
  /*  data={data}*/
}
{
  /*  y="Reach"*/
}
{
  /*  x="Claim"*/
}
{
  /*  style={{*/
}
{
  /*    labels: { fontSize: 9 },*/
}
{
  /*  }}*/
}
{
  /*  labelComponent={*/
}
{
  /*    <VictoryTooltip*/
}
{
  /*      activateData*/
}
{
  /*      labels={({ datum }) => `${datum.x}`}*/
}
{
  /*      cornerRadius={2}*/
}
{
  /*      pointerLength={5}*/
}
{
  /*      flyoutStyle={{*/
}
{
  /*        stroke: "#ccc",*/
}
{
  /*        fill: "#eee",*/
}
{
  /*      }}*/
}
{
  /*      style={{ fontSize: 22, fill: "#555", padding: 10 }}*/
}
{
  /*    />*/
}
{
  /*  }*/
}
{
  /*>*/
}
{
  /*<VictoryLine*/
}
{
  /*  data={data}*/
}
{
  /*  y="Reach"*/
}
{
  /*  x="Claim"*/
}
{
  /*  domain={{ y: [0, 100] }}*/
}
{
  /*  style={{*/
}
{
  /*    data: { stroke: "#ccc", strokeWidth: 2 },*/
}
{
  /*  }}*/
}
{
  /*  labels={(data) => `${data.Reach}`}*/
}
{
  /*  labelComponent={<VictoryTooltip activateData={true} />}*/
}
{
  /*/>*/
}
