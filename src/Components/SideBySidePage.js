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

export default function SideBySidePage() {
  const { setups, setSetups } = React.useContext(SetupContext);

  const { claims } = React.useContext(ClaimsContext);

  const metricRendering = {
    Average_Number_of_Items_Liked: {
      displayLabel: "Average Liked Claims",
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
  // console.log(
  //   summaryMetricKeys.map((summaryMetricKey) =>
  //     setups.map((setup) => setup[1]?.[summaryMetricKey])
  //   )
  // );

  const handleDeleteSetup = () => {
    setSetups([]);
  };

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
        size={"lg"}
        variant={"simple"}
        w={"85%"}
        align={"center"}
        marginTop={12}
      >
        <Thead>
          {summaryMetricKeys.map((summaryMetricKey) => (
            <Tr>
              <Td />
              <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                {metricRendering[summaryMetricKey].displayLabel}
              </Th>
              {setups.map((setup) => [
                <Td isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                  {setup[1]?.[summaryMetricKey] ===
                  setup[1]?.["Average_Number_of_Items_Liked"]
                    ? avgFormatter(setup[1]?.["Average_Number_of_Items_Liked"])
                    : valueFormatter(setup[1]?.[summaryMetricKey])}
                </Td>,
              ])}
            </Tr>
          ))}
        </Thead>
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
              <Th>{i + 1}</Th>
              <Td boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>{claim}</Td>
              {setups.map((setup) => (
                <Td
                  w={"20%"}
                  textAlign={"center"}
                  boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                >
                  {setup[0]?.[claim]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
}
