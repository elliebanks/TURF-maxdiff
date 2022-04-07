import React from "react";
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
  Box,
} from "@chakra-ui/react";
import { CheckboxContext, SummaryContext } from "./TURFpage";
import { ClaimsContext } from "../App.js";

const DataTable = () => {
  const { claimState, setClaimState } = React.useContext(CheckboxContext);

  const { reach, favorite } = React.useContext(SummaryContext);

  const { claims } = React.useContext(ClaimsContext);

  // pass claim and newValue to the onChange handler
  // keeps a record of the previous state of the claim, and assigns the value of the radio button click as the
  // new value for the claim
  // handled in one function because the radio buttons are a group of buttons, and only one can state can be applied per claim
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
    <Table variant="simple" size={"lg"} w={"85%"} align={"center"}>
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
          <Th>Claim</Th>
          <Th textAlign={"center"}>Offered</Th>
          <Th textAlign={"center"}>Considered</Th>
          <Th textAlign={"center"}>Excluded</Th>
          <Th textAlign={"center"}>Reach</Th>
          <Th textAlign={"center"} boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
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
            <Th>{i + 1}</Th>
            <Td>{claim}</Td>
            <Th textAlign={"center"}>
              <Radio value={"Offered"} />
            </Th>
            <Th textAlign={"center"}>
              <Radio value={"Considered"} />
            </Th>
            <Th textAlign={"center"}>
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
  );
};

export default DataTable;
