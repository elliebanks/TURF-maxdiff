import React, { useEffect } from "react";
import { Select, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { SelectedSubgroupContext, SummaryContext } from "./TURFpage";

// export const SubgroupContext = React.createContext("Filter by Subgroup");

const SummaryMetricTable = () => {
  const {
    subgroupFilter,
    setNumberOfSubgroupRespondents,
    numberOfSubgroupRespondents,
    selectedSubgroup,
    setSelectedSubgroup,
  } = React.useContext(SelectedSubgroupContext);

  const {
    setReach,
    setFavorite,
    setSummaryMetrics,
    summaryMetrics,
    offeredClaims,
  } = React.useContext(SummaryContext);

  function getDecimalAsPercentString(decimal, numDecimals = 1) {
    if (typeof decimal !== "number") return "";
    const outOf100 = decimal * 100;
    return outOf100.toFixed(numDecimals) + "%";
  }

  // console.log(summaryMetrics);

  let avgLikedItemsDecimal = summaryMetrics?.["Average_Number_of_Items_Liked"];
  let roundedAvgLikedItems = Math.round(avgLikedItemsDecimal * 100) / 100;
  // console.log(roundedAvgLikedItems);

  let avgReachPercentage = getDecimalAsPercentString(summaryMetrics?.["Reach"]);
  let avgFavPercentage = getDecimalAsPercentString(
    summaryMetrics?.["Favorite_Percentage"]
  );

  const handleSelectedSubgroup = (e) => {
    setSelectedSubgroup(e.target.value);
  };

  console.log(selectedSubgroup);

  useEffect(
    function handleSelectedSubgroupReach() {
      fetch("/api/subgroup_reach_scores", {
        method: "POST",
        body: JSON.stringify({ selectedSubgroup }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          console.log(data);
          setReach(data["Claim_Reach"]);
          setFavorite(data["Claim_Favorite"]);
        });
    },
    [selectedSubgroup, setReach, setFavorite]
  );

  useEffect(
    function handleSelectedSubgroupSummaryMetrics() {
      fetch("/api/request_subgroup_summary_metrics", {
        method: "POST",
        body: JSON.stringify({ selectedSubgroup, offeredClaims }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSummaryMetrics(data["summary_metrics"]["Summary_Metrics"]);
          setNumberOfSubgroupRespondents(data["number_of_respondents"]);
        });
    },
    [selectedSubgroup, offeredClaims]
  );

  return (
    <Table
      size={"lg"}
      variant={"simple"}
      w={"50%"}
      align={"start"}
      // marginTop={12}
      // marginBottom={12}
    >
      <Thead>
        <Tr>
          <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>Summary Metrics</Th>
          <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
            <Select
              value={selectedSubgroup}
              onChange={handleSelectedSubgroup}
              placeholder={"Filter by Subgroup"}
              display={"flex"}
              float={"right"}
              w={"fit-content"}
            >
              {subgroupFilter?.map((subgroup) => (
                <option>{subgroup}</option>
              ))}
            </Select>

            {/*</HStack>*/}
          </Td>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
            Total Number of Respondents in Group :
          </Td>
          <Td
            isNumeric
            boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
            textAlign={"center"}
          >
            {numberOfSubgroupRespondents}
          </Td>
        </Tr>
        <Tr>
          <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
            Average Number of Liked Items :
          </Td>
          <Td
            isNumeric
            boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
            textAlign={"center"}
          >
            {roundedAvgLikedItems}
          </Td>
        </Tr>
        <Tr>
          <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>Average Reach :</Td>
          <Td
            isNumeric
            boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
            textAlign={"center"}
          >
            {avgReachPercentage}
          </Td>
        </Tr>
        <Tr>
          <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
            Average Favorite :
          </Td>
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
  );
};

export default SummaryMetricTable;
