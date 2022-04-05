import * as React from "react";
import {
  Box,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  Tfoot,
  Checkbox,
  Divider,
  Spacer,
  Button,
  Container,
  HStack,
} from "@chakra-ui/react";
import { ClaimsContext } from "../App";
import { CheckboxContext, SetupContext, SummaryContext } from "./TURFpage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";

export default function SideBySidePage() {
  const { setups, setSetups } = React.useContext(SetupContext);
  console.log(setups);
  // console.log(setups[0]);
  // const setupClaimState = setups[0];
  // console.log(setupClaimState["claimState"]);
  // const myClaimStates = setupClaimState["claimState"];
  // console.log(Object.values(myClaimStates));
  // const values = Object.values(myClaimStates);
  // const keys = Object.keys(myClaimStates);

  const { claims } = React.useContext(ClaimsContext);

  function getDecimalAsPercentString(decimal, numDecimals = 1) {
    if (typeof decimal !== "number") return "";
    const outOf100 = decimal * 100;
    return outOf100.toFixed(numDecimals) + "%";
  }

  const metricRendering = {
    Average_Number_of_Items_Liked: {
      displayLabel: "Average Number of Liked Claims",
    },
    Favorite_Percentage: {
      displayLabel: "Average Favorite",
    },
    Reach: {
      displayLabel: "Average Reach",
    },
  };

  const valueFormatter = (value) => (value * 100).toFixed(2) + "%";
  const avgFormatter = (value) => Math.round(value * 100) / 100;

  const summaryMetricKeys = Object.keys(metricRendering);

  const handleDeleteSetup = () => {
    setSetups([]);
  };

  // console.log(
  //   setups.map((setup) => {
  //     const mySetup = setup["claimState"];
  //     console.log(mySetup);
  //     const claimsAndTheirStates = Object.entries(mySetup);
  //     console.log(claimsAndTheirStates);
  //     {
  //       claimsAndTheirStates.map((claims) =>
  //         claims[1] === "Considered" ? "Considered" : ""
  //       );
  //     }
  //   })
  // );

  const exportToCSV = (event) => {
    event.preventDefault();
    fetch("/api/export_to_csv", {
      method: "POST",
      body: JSON.stringify({ claims, setups }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        // const href = window.URL.createObjectURL(data);
        // const a = document.createElement("a");
        // a.download = `SideBySide.csv`;
        // a.href = href;
        // a.click();
        // a.href = "";
      });
  };

  return (
    <>
      <HStack spacing={4}>
        <Button size={"lg"} onClick={exportToCSV}>
          Export to CSV
        </Button>
        <Button size={"lg"} onClick={handleDeleteSetup}>
          Delete Setups
        </Button>
      </HStack>
      <Table
        align={"center"}
        size={"lg"}
        maxW={"75%"}
        variant={"simple"}
        marginBottom={6}
      >
        <Thead>
          <Tr>
            <Th />
            <Th />
            <Th />
            <Th />
            <Th />
            <Th />
            <Th />
            <Td />
            <Td />
            <Td />
            <Td />
            {setups.map((setup, i) => [
              <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                Setup {i + 1}
              </Th>,
              <Th />,
              <Th />,
              <Th />,
            ])}
          </Tr>
        </Thead>
        <Tbody>
          {/*{summaryMetricKeys.map((summaryMetricKey) => (*/}
          {/*  <Tr>*/}
          {/*    <Th>{metricRendering[summaryMetricKey].displayLabel}</Th>*/}
          {/*    <Th />*/}
          {/*    <Th />*/}
          {/*    <Th />*/}
          {/*    <Th />*/}
          {/*    <Th />*/}
          {/*    <Th />*/}
          {/*    <Th />*/}
          {/*    <Td />*/}
          {/*    <Td />*/}
          {/*    <Td />*/}
          {/*    <Td />*/}
          {/*    /!*{setups.map((set) => [*!/*/}
          {/*    /!*  <Td isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>*!/*/}
          {/*    /!*    {summaryMetricKey === "Average_Number_of_Items_Liked"*!/*/}
          {/*    /!*      ? avgFormatter(set.summaryMetrics[summaryMetricKey])*!/*/}
          {/*    /!*      : valueFormatter(set.summaryMetrics[summaryMetricKey])}*!/*/}
          {/*     */}
          {/*      <Td />,*/}
          {/*      <Td />,*/}
          {/*      <Td />,*/}
          {/*    /!*])}*!/*/}
          {/*  </Tr>*/}
          {/*))}*/}
        </Tbody>
      </Table>

      <Table size={"lg"} variant={"simple"} align={"center"} maxW={"75%"}>
        <Thead>
          <Tr>
            <Th w={1}>#</Th>
            <Th boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>Claim</Th>
            {setups.map((setup, i) => [
              <Th
                textAlign={"center"}
                boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
              >
                Setup {i + 1}
              </Th>,
            ])}
          </Tr>
        </Thead>
        <Tbody>
          {claims.map((claim, i) => (
            <Tr>
              <Th w={1}>{i + 1}</Th>
              <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>{claim}</Td>
              {/*{setups.map((setup) => )}*/}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}

// {setups.map((setup) => [
//                 <Td textAlign={"center"}>
//                   {setup.currentOfferings.includes(claim) ? "X" : ""}
//                 </Td>,
//                 <Td textAlign={"center"}>
//                   {setup.considerationSet.includes(claim) ? "X" : ""}
//                 </Td>,
//                 <Td textAlign={"center"}>
//                   {setup.currentOfferings.includes(claim)
//                     ? getDecimalAsPercentString(setup.reach?.[claim])
//                     : ""}
//                 </Td>,
//                 <Td
//                   textAlign={"center"}
//                   boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
//                 >
//                   {setup.currentOfferings.includes(claim)
//                     ? getDecimalAsPercentString(setup.favorite?.[claim])
//                     : ""}
//                 </Td>,
//               ])}
