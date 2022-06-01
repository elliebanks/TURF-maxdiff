import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Text,
  Flex,
  Button,
  HStack,
  Container,
  VStack,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import {
  CheckboxContext,
  SelectedSubgroupContext,
  SummaryContext,
} from "./TURFpage";
import { ClaimsContext } from "../App";
import SummaryMetricTable from "./SummaryMetricTable";
import RunTurf from "./RunTurf";

const DataTable = () => {
  const { claimState, setClaimState } = React.useContext(CheckboxContext);
  const { setSubgroupFilter, subgroupFilter } = React.useContext(
    SelectedSubgroupContext
  );

  const { reach, favorite } = React.useContext(SummaryContext);

  const { claims } = React.useContext(ClaimsContext);

  useEffect(() => {
    fetch("/api/check_db_for_subgroup")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setSubgroupFilter(data);
      });
  }, []);

  const handleClaimStateChange = (claim, newValue) => {
    setClaimState((prev) => {
      const newClaimState = { ...prev, [claim]: newValue };
      console.log({ [claim]: newValue });
      return newClaimState;
    });
  };

  // function takes the state of each claim and creates a new state to set them all to Considered on button click
  function resetClaimsToConsidered() {
    setClaimState((prev) => {
      const newClaimState = Object.keys(prev).map((claim) => [
        claim,
        "Considered",
      ]);
      return Object.fromEntries(newClaimState);
    });
  }

  // function handles the conversion of Reach & Favorite decimals to display as percentages
  function getDecimalAsPercentString(decimal, numDecimals = 1) {
    if (typeof decimal !== "number") return "";
    const outOf100 = decimal * 100;
    return outOf100.toFixed(numDecimals) + "%";
  }

  return (
    <>
      {/*<SubgroupContext.Provider value={subgroupData}>*/}

      <VStack spacing={12}>
        <SummaryMetricTable />
        <RunTurf />

        <Table
          variant="simple"
          size={"lg"}
          w={"85%"}
          align={"center"}
          // boxShadow={"0px 20px 50px 20px rgba(0,0,0,0.5)"}
        >
          <Thead>
            <Tr>
              <Th />
              <Td>
                <Button onClick={resetClaimsToConsidered} size={"md"}>
                  Reset Claims to Considered
                </Button>
              </Td>
              <Th />
              <Th />
              <Th />
              <Th />
              <Th />
            </Tr>
          </Thead>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>Claim</Th>
              <Th textAlign={"center"}>Offered</Th>
              <Th textAlign={"center"}>Considered</Th>
              <Th
                textAlign={"center"}
                boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              >
                Excluded
              </Th>
              <Th textAlign={"center"}>Reach</Th>
              <Th
                textAlign={"center"}
                boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              >
                Favorite
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {claims.map((claim, i) => (
              <RadioGroup
                as={Tr}
                value={claimState[claim]} // value of each radio button in the group is the state of the claim
                onChange={(newValue) => handleClaimStateChange(claim, newValue)}
              >
                <Th key={i}>{i + 1}</Th>
                <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"} key={claim}>
                  {claim}
                </Td>
                <Th textAlign={"center"}>
                  <Radio value={"Offered"} />
                </Th>
                <Th textAlign={"center"}>
                  <Radio value={"Considered"} />
                </Th>
                <Th
                  textAlign={"center"}
                  boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                >
                  <Radio value={"Excluded"} />
                </Th>
                <Th textAlign={"center"}>
                  {getDecimalAsPercentString(reach?.[claim])}
                </Th>
                <Th
                  textAlign={"center"}
                  boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                >
                  {getDecimalAsPercentString(favorite?.[claim])}
                </Th>
              </RadioGroup>
            ))}
          </Tbody>
        </Table>
      </VStack>
      {/*</SubgroupContext.Provider>*/}
    </>
  );
};

export default DataTable;
