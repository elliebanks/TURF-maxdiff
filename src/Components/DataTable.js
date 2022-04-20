import React, { useRef, useState } from "react";
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
  Input,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Grid,
} from "@chakra-ui/react";
import { CheckboxContext, SummaryContext } from "./TURFpage";
import { ClaimsContext } from "../App.js";
import SummaryMetrics from "../Top Level Components/SummaryMetrics";

const DataTable = () => {
  const { claimState, setClaimState } = React.useContext(CheckboxContext);

  const { reach, favorite } = React.useContext(SummaryContext);

  const { claims } = React.useContext(ClaimsContext);

  const [subgroupFilter, setSubgroupFilter] = React.useState([]);

  const [subgroupFile, setSubgroupFile] = useState();

  const [subgroupFileSelected, setSubgroupFileSelected] = useState(false);

  const subgroupInputRef = useRef(null);
  const handleSubgroupFile = (event) => {
    setSubgroupFile(event.target.files[0]);
    setSubgroupFileSelected(true);
    console.log(event.target.files[0]);
  };

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
        "Excluded", // setting to excluded for testing purposes
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

  const { summaryMetrics } = React.useContext(SummaryContext);
  // console.log(summaryMetrics);

  let avgLikedItemsDecimal = summaryMetrics["Average_Number_of_Items_Liked"];
  let roundedAvgLikedItems = Math.round(avgLikedItemsDecimal * 100) / 100;
  // console.log(roundedAvgLikedItems);

  let avgReachPercentage = getDecimalAsPercentString(summaryMetrics["Reach"]);
  let avgFavPercentage = getDecimalAsPercentString(
    summaryMetrics["Favorite_Percentage"]
  );

  const handleSubgroupSubmission = () => {
    let formData = new FormData();
    formData.append("subgroup", subgroupFile);
    // show spinning mouse cursor
    // document.body.style.cursor = "progress";
    let status = 0;
    fetch("/api/request_load_subgroup", { method: "POST", body: formData })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setSubgroupFilter(data);
        // sets list of claims to the claims from the uploaded Excel file
      })
      .finally(() => {
        // give regular mouse cursor back
        document.body.style.cursor = "default";
      });
  };
  console.log(subgroupFilter);

  const [selectedSubgroup, setSelectedSubgroup] = React.useState("Total");
  const handleSelectedSubgroup = (e) => {
    setSelectedSubgroup(e.target.value);
  };

  console.log(selectedSubgroup);

  return (
    <>
      <VStack w={"50%"} alignContent={"flex-end"}>
        <Button
          size={"md"}
          padding={6}
          onClick={() => subgroupInputRef.current.click()}
        >
          Select Subgroup .xlsx File
        </Button>
        <input
          name="file"
          type="file"
          accept=".xlsx, .xls"
          ref={subgroupInputRef}
          onChange={handleSubgroupFile}
          hidden
          required
        />
        {subgroupFileSelected ? (
          <div>
            <p>Filename: {subgroupFile.name}</p>
            <p>Filetype: {subgroupFile.type}</p>
            <p>Size in bytes: {subgroupFile.size}</p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        <Button
          size={"md"}
          padding={6}
          type={"submit"}
          value={"Submit"}
          onClick={handleSubgroupSubmission}
        >
          Submit Subgroup File
        </Button>
      </VStack>
      <Container maxWidth={"85%"} alignContent={"center"}>
        <Table
          size={"lg"}
          variant={"simple"}
          // w={"70%"}
          marginTop={12}
          marginBottom={12}
        >
          <Thead>
            <Tr>
              <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                Summary Metrics
              </Th>
              <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                <Select
                  value={selectedSubgroup}
                  onChange={handleSelectedSubgroup}
                  placeholder={"Filter by Subgroup"}
                  display={"flex"}
                  float={"right"}
                >
                  {subgroupFilter?.map((subgroup) => (
                    <option>{subgroup}</option>
                  ))}
                </Select>
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
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
              <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
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
              <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
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
        <Table variant="simple" size={"lg"} align={"center"}>
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
                <Th>{i + 1}</Th>
                <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>{claim}</Td>
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
        {/*</VStack>*/}
      </Container>
    </>
  );
};

export default DataTable;
