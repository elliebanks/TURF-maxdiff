import React, { useRef, useState } from "react";
import {
  Button,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { SummaryContext } from "../Components/TURFpage";

function SummaryMetrics() {
  const { summaryMetrics } = React.useContext(SummaryContext);
  // console.log(summaryMetrics);

  let avgLikedItemsDecimal = summaryMetrics["Average_Number_of_Items_Liked"];
  let roundedAvgLikedItems = Math.round(avgLikedItemsDecimal * 100) / 100;
  // console.log(roundedAvgLikedItems);

  let avgReachPercentage = getDecimalAsPercentString(summaryMetrics["Reach"]);
  let avgFavPercentage = getDecimalAsPercentString(
    summaryMetrics["Favorite_Percentage"]
  );

  function getDecimalAsPercentString(decimal, numDecimals = 1) {
    if (typeof decimal !== "number") return "";
    const outOf100 = decimal * 100;
    return outOf100.toFixed(numDecimals) + "%";
  }

  return (
    <>
      <Table
        size={"lg"}
        variant={"simple"}
        w={"40%"}
        marginTop={12}
        display={"inline-table"}
      >
        <Thead>
          <Tr>
            <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
              Summary Metrics
            </Th>
            <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
              Total Sample
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
              Average Number of Liked Items :
            </Th>
            <Td
              isNumeric
              boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              textAlign={"center"}
            >
              {roundedAvgLikedItems}
            </Td>
          </Tr>
          <Tr>
            <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
              Average Reach :
            </Th>
            <Td
              isNumeric
              boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              textAlign={"center"}
            >
              {avgReachPercentage}
            </Td>
          </Tr>
          <Tr>
            <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
              Average Favorite :
            </Th>
            <Td
              isNumeric
              boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              textAlign={"center"}
            >
              {avgFavPercentage}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
}

export default SummaryMetrics;
