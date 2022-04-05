import React from "react";
import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { SummaryContext } from "../Components/TURFpage";

function SummaryMetrics() {
  const { summaryMetrics } = React.useContext(SummaryContext);
  console.log(summaryMetrics);

  let avgLikedItemsDecimal = summaryMetrics["Average_Number_of_Items_Liked"];
  let roundedAvgLikedItems = Math.round(avgLikedItemsDecimal * 100) / 100;
  console.log(roundedAvgLikedItems);

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
    <Table variant="simple" size={"md"}>
      <Thead>
        <Tr>
          <Th>Summary Metrics</Th>
          <Th>Total Sample</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Average Number of Liked Items :</Td>
          <Td textAlign={"center"}>{roundedAvgLikedItems}</Td>
        </Tr>
        <Tr>
          <Td>Average Reach :</Td>
          <Td textAlign={"center"}>{avgReachPercentage}</Td>
        </Tr>
        <Tr>
          <Td>Average Favorite :</Td>
          <Td textAlign={"center"}>{avgFavPercentage}</Td>
        </Tr>
      </Tbody>
    </Table>
  );
}

export default SummaryMetrics;
