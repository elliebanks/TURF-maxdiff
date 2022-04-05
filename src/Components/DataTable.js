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
import GroupCheckbox from "../Top Level Components/GroupCheckbox";
import { CheckboxContext, SummaryContext } from "./TURFpage";
import { ClaimsContext } from "../App.js";

const DataTable = () => {
  const {
    claimState,
    setClaimState,
    // currentOfferings,
    // considerationSet,
    // excludedSet,
    // setExcludedSet,
    // setCurrentOfferings,
    // setConsiderationSet,
    // getExcludedSetCheckboxProps,
    // getCurrentOfferingsCheckboxProps,
    // getConsiderationSetCheckboxProps,
  } = React.useContext(CheckboxContext);

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

  // function takes the state of each claim and creates a new state to set them all to Excluded on button click
  function resetClaimsToExcluded() {
    setClaimState((prev) => {
      const newClaimState = Object.keys(prev).map((claim) => [
        claim,
        "Excluded",
      ]);
      console.log(newClaimState);
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
      <Table variant="simple" size={"lg"}>
        <Thead>
          <Tr>
            <Th />
            <Td>
              <Button onClick={resetClaimsToExcluded} size={"lg"}>
                Reset
              </Button>
            </Td>

            <Th />
            <Th />
            <Th />
          </Tr>
        </Thead>
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th
              textAlign={"center"}
              boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
            >
              Claim
            </Th>
            <RadioGroup
              boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              justify={"space-evenly"}
              display={"inline-block"}
              m={"5px 20px 0px 150px"}
            >
              <Th>Offered</Th>
              <Th>Considered</Th>
              <Th>Excluded</Th>
            </RadioGroup>

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
            <Tr key={i}>
              <Th>{i + 1}</Th>
              <Td
                key={i}
                boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                textAlign={"center"}
              >
                {claim}
              </Td>
              {/*<Container justify={"space-evenly"} border={"1px solid black"}>*/}
              <RadioGroup
                as={Td}
                value={claimState[claim]}
                onChange={(newValue) => handleClaimStateChange(claim, newValue)}
                boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                display={"inline-block"}
                m={"5px 5px 0 162px"}
              >
                <HStack spacing={150}>
                  <Radio value={"Offered"} />

                  <Radio value={"Considered"} />

                  <Radio value={"Excluded"} />
                </HStack>
              </RadioGroup>
              {/*</Container>*/}

              {/*<Box>*/}

              {/*</Box>*/}
              <Td textAlign={"center"}>
                {getDecimalAsPercentString(reach?.[claim])}
              </Td>
              <Td
                textAlign={"center"}
                boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              >
                {getDecimalAsPercentString(favorite?.[claim])}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default DataTable;

{
  /*<GroupCheckbox*/
}
{
  /*  {...getConsiderationSetCheckboxProps({ value: claim })}*/
}
{
  /*/>*/
}
{
  /*</Td>*/
}
{
  /*<Td>*/
}
