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
import { ReachContext } from "./TURFpage";
import "../Styles/chartStyles.css";
import CustomToolTip from "./Custom Utils/CustomToolTip";
import {
  ChakraProvider,
  LightMode,
  useColorMode,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";

const styles = { padding: "5px", border: "1px solid #cccc" };

export default function Graph() {
  const { colorMode } = useColorMode();
  const { orderOfItems, incrementalReachSummary } =
    React.useContext(ReachContext);

  const data = React.useMemo(() => {
    return orderOfItems?.map((claim, i) => ({
      Claim: claim,
      Reach: (
        incrementalReachSummary[claim]?.Summary_Metrics.Reach * 100
      ).toFixed(1),
    }));
  }, [orderOfItems, incrementalReachSummary]);

  const tickFormatter = (value: string, index: number) => {
    const limit = 30; // put your maximum character

    if (value.length < limit) return value;
    return `${value.substring(0, limit)}...`;
  };

  // active = if tooltip is being actively viewed or not
  // payload = what data is being hovered
  // label = the x value/ the label for the payload

  return (
    <ResponsiveContainer
      width={"90%"}
      height={"90%"}
      aspect={2}
      minWidth={"undefined"}
      maxHeight={"undefined"}
    >
      <LineChart
        // width={500}
        // height={600}

        data={data}
        margin={{
          top: 50,
          right: 200,
          left: 200,
          bottom: 200,
        }}
      >
        <CartesianGrid
          strokeDasharray="3"
          opacity={colorMode === "dark" ? 0.3 : 0.9}
        />
        <XAxis
          dataKey="Claim"
          tickFormatter={tickFormatter}
          interval="preserveStartEnd"
          angle={-25}
          textAnchor={"end"}
          // axisLine={false}
          tickMargin={10}
          style={{ fill: colorMode === "dark" ? "#FFFFFF" : "#1A202C" }}
          // tickLine={false}
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
  );
}
