import React from "react";
import {
  LineChart,
  Label,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import "../Styles/chartStyles.css";
import CustomToolTip from "./Custom Utils/CustomToolTip";
import { useColorMode } from "@chakra-ui/react";
import { ReachContext } from "./RunTurf";
import { SelectedSubgroupContext } from "./TURFpage";
import CustomizedTick from "./Custom Utils/CustomXAxisLabel";

const Graph = () => {
  const { colorMode } = useColorMode();

  const { orderOfItems, incrementalReachSummary } =
    React.useContext(ReachContext);

  const { numberOfSubgroupRespondents, selectedSubgroup } = React.useContext(
    SelectedSubgroupContext
  );

  const data = React.useMemo(() => {
    return orderOfItems?.map((claim, i) => ({
      Item: i + 1,
      Claim: claim,
      // split(" ").join("\n"),
      Reach: (
        incrementalReachSummary[claim]?.Summary_Metrics.Reach * 100
      ).toFixed(1),
    }));
  }, [orderOfItems, incrementalReachSummary]);
  console.log(data);

  return (
    <>
      <ResponsiveContainer
        align={"center"}
        w={"75%"}
        height={300}
        aspect={2}
        minWidth={"undefined"}
        maxHeight={"undefined"}
      >
        <LineChart
          data={data}
          margin={{
            top: 50,
            right: 250,
            left: 250,
            bottom: 400,
          }}
        >
          <CartesianGrid
            strokeDasharray="3"
            opacity={colorMode === "dark" ? 0.3 : 0.9}
          />
          <XAxis
            // hide={true}
            dataKey={"Claim"}
            tick={<CustomizedTick />}
            interval={0}
            // tickFormatter={tickFormatter}
            axisLine={false}
          >
            {/*<Label value="Claim" offset={100} position="bottom" />*/}
          </XAxis>
          <YAxis
            type={"number"}
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tickCount={7}
            tickMargin={10}
            tickFormatter={(Reach) => `${Reach}%`}
            style={{ fill: colorMode === "dark" ? "#FFFFFF" : "#1A202C" }}
          />
          <Tooltip content={<CustomToolTip />} />
          <Line
            type="monotone"
            strokeWidth={3}
            dataKey="Reach"
            stroke="#3182CE"
            activeDot={{ r: 9 }}
          >
            <LabelList
              dataKey="Reach"
              offset={14}
              position="insideTopLeft"
              formatter={(Reach) => `${Reach}%`}
              fill={colorMode === "dark" ? "#FFFFFF" : "#1A202C"}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default Graph;
