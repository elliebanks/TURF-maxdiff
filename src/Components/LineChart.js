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
import {
  Box,
  Container,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { ReachContext } from "./RunTurf";
import CustomTick from "./Custom Utils/CustomXAxisLabel";
import { SelectedSubgroupContext } from "./TURFpage";
import CustomizedTick from "./Custom Utils/CustomXAxisLabel";

const styles = { padding: "5px", border: "1px solid #cccc" };

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

  // function CustomizedTick(props) {
  //   const { x, y, stroke, payload } = props;
  //   return (
  //     <g transform={`translate(${x},${y})`}>
  //       <text x={0} y={0} dy={16} fill="#666">
  //         <tspan textAnchor="middle" x="0">
  //           Line 1
  //         </tspan>
  //         <tspan textAnchor="middle" x="0" dy="20">
  //           Line 2
  //         </tspan>
  //         <tspan textAnchor="middle" x="0" dy="40">
  //           Line 3
  //         </tspan>
  //       </text>
  //     </g>
  //   );
  // }

  // const tickFormatter = (value: string) => {
  //   const limit = 10; // put your maximum character
  //
  //   if (value.length < limit) return value;
  //   return `${value.split(" ").join("\n")}...`;
  // };

  return (
    <>
      <ResponsiveContainer
        align={"center"}
        w={"60%"}
        height={400}
        aspect={2}
        minWidth={"undefined"}
        maxHeight={"undefined"}
      >
        <LineChart
          data={data}
          margin={{
            top: 50,
            right: 300,
            left: 300,
            bottom: 600,
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
      {/*<Box*/}
      {/*  display={"flex"}*/}
      {/*  flexDirection={"row"}*/}
      {/*  justifyItems={"space-between"}*/}
      {/*  padding={2}*/}
      {/*>*/}
      {/*  {" "}*/}
      {/*  <HStack spacing={200}>*/}
      {/*    {data.map((item) => (*/}
      {/*      <Container*/}
      {/*        textAlign={"center"}*/}
      {/*        width={150}*/}
      {/*        // marginRight={50}*/}
      {/*        // justify={"space-evenly"}*/}
      {/*      >*/}
      {/*        {item["Claim"].split(" ").join("\n")}*/}
      {/*      </Container>*/}
      {/*    ))}*/}
      {/*  </HStack>*/}
      {/*</Box>*/}

      {/*<Table height={300} position={"sticky"}>*/}
      {/*  <Tbody verticalAlign={"text-top"}>*/}
      {/*    <Tr*/}
      {/*      overflowX={orderOfItems.length > 8 ? "scroll" : "hidden"}*/}
      {/*      overflowY={orderOfItems.length > 8 ? "hidden" : "hidden"}*/}
      {/*      align={"start"}*/}
      {/*      justifyContent={"space-evenly"}*/}
      {/*      display={"flex"}*/}
      {/*      flexDirection={"row"}*/}
      {/*      width={orderOfItems.length > 8 ? 1200 : 1250}*/}
      {/*      // width={*/}
      {/*      //   orderOfItems.length >= 5*/}
      {/*      //     ? 1400*/}
      {/*      //     : orderOfItems.length === 4*/}
      {/*      //     ? 1425*/}
      {/*      //     : orderOfItems.length === 3*/}
      {/*      //     ? 1350*/}
      {/*      //     : orderOfItems.length === 2*/}
      {/*      //     ? 2000*/}
      {/*      //     : 1400*/}
      {/*      // }*/}
      {/*    >*/}
      {/*      {data.map((item) => (*/}
      {/*        <Box*/}
      {/*          textAlign={"center"}*/}
      {/*          // justify={"space-between"}*/}
      {/*          w={"140px"}*/}
      {/*          style={{ fontSize: "14px" }}*/}
      {/*          p={6}*/}
      {/*          // p={25}*/}
      {/*          // whiteSpace={"unset"}*/}
      {/*        >*/}
      {/*          {item["Claim"].split(" ").join("\n")}*/}
      {/*        </Box>*/}
      {/*      ))}*/}
      {/*    </Tr>*/}
      {/*  </Tbody>*/}
      {/*</Table>*/}
      {/*<Table*/}
      {/*  // border={"1px"}*/}
      {/*  size={"sm"}*/}
      {/*  maxW={"35%"}*/}
      {/*  // maxW={"40%"}*/}
      {/*  height={"75%"}*/}
      {/*  // align={"flex-start"}*/}
      {/*  p={12}*/}
      {/*>*/}
      {/*  <Tbody display={"flex"} flexDirection={"column"}>*/}
      {/*    <Tr>*/}
      {/*      <Th>Segmentation Group :</Th>*/}
      {/*      <Td>{selectedSubgroup}</Td>*/}
      {/*    </Tr>*/}
      {/*    <Tr>*/}
      {/*      <Th>Number of Respondents in Group :</Th>*/}
      {/*      <Td>{numberOfSubgroupRespondents}</Td>*/}
      {/*    </Tr>*/}

      {/*    {orderOfItems.map((item, i) => [*/}
      {/*      <Th>Step {i + 1} :</Th>,*/}
      {/*      <Td>*/}
      {/*        {item.length > 120 ? item?.substring(0, 120) + "..." : item}*/}
      {/*      </Td>,*/}
      {/*    ])}*/}
      {/*  </Tbody>*/}
      {/*  /!*<Tbody display={"flex"} flexDirection={"column"}>*!/*/}
      {/*  /!*  {orderOfItems.map((item, i) => [*!/*/}
      {/*  /!*    <Td>*!/*/}
      {/*  /!*      {item.length > 30 ? item?.substring(0, 100) + "..." : item}*!/*/}
      {/*  /!*    </Td>,*!/*/}
      {/*  /!*  ])}*!/*/}
      {/*  /!*</Tbody>*!/*/}
      {/*</Table>*/}

      {/*<Container textAlign={"center"} w={"10%"} maxW={"12%"}>*/}
      {/*  Subgroup: {selectedSubgroup} Number of Respondents:{" "}*/}
      {/*  {numberOfSubgroupRespondents}*/}
      {/*</Container>*/}

      {/*<CustomTick />*/}
      {/*</ResponsiveContainer>*/}
    </>
  );
};

export default Graph;
