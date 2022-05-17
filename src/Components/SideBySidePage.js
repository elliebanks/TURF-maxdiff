import * as React from "react";
import {
  Box,
  Table,
  Tbody,
  Thead,
  Tr,
  Th,
  Td,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
  VStack,
} from "@chakra-ui/react";
import { ClaimsContext } from "../App";
import { SetupContext } from "./TURFpage";
import { ChevronDownIcon, DeleteIcon, DownloadIcon } from "@chakra-ui/icons";
import { TabContext } from "./RunTurf";

export default function SideBySidePage() {
  const { colorMode } = useColorMode();
  const { setTabIndex } = React.useContext(TabContext);
  const { setups, setSetups } = React.useContext(SetupContext);
  console.log(setups);

  const { claims } = React.useContext(ClaimsContext);

  const setupSummaryMetricHeaders = [
    "Subgroup",
    "Number of Respondents",
    "Average Liked",
    "Average Reach",
    "Average Favorite",
  ];

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

  const valueFormatter = (value) => (value * 100).toFixed(1) + "%";
  const avgFormatter = (value) => Math.round(value * 100) / 100;

  const summaryMetricKeys = Object.keys(metricRendering);

  const handleDeleteSetup = () => {
    setSetups([]);
    setTabIndex(0);
  };

  const exportToCSV = () => {
    fetch("/api/export_prev_sim_to_csv", {
      method: "POST",
      body: JSON.stringify({ setups }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((data) => {
        console.log(data);
        const href = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.download = `Simulation_Summary.csv`;
        a.href = href;
        a.click();
        a.href = "";
      });
  };

  return (
    <>
      <VStack spacing={12}>
        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                isActive={isOpen}
                as={Button}
                rightIcon={<ChevronDownIcon />}
                alignSelf={"flex-start"}
                // alignSelf={"flex-end"}
                // display={"flex"}
                // float={"left"}
              >
                Previous Simulation Options
              </MenuButton>
              <MenuList>
                <MenuItem icon={<DownloadIcon />} onClick={exportToCSV}>
                  Download as CSV
                </MenuItem>
                <MenuItem onClick={handleDeleteSetup} icon={<DeleteIcon />}>
                  Delete Setups
                </MenuItem>
              </MenuList>
            </>
          )}
        </Menu>

        <Table
          size={"lg"}
          variant={"simple"}
          w={"85%"}
          align={"center"}
          // display={"flex"}
          // flexDirection={"column"}

          // marginTop={25}
        >
          <Thead>
            <Td />
            <Td />
            {setups.map((setup, i) => (
              <Th textAlign={"right"}>Setup {i + 1}</Th>
            ))}
          </Thead>
          <Thead>
            {setupSummaryMetricHeaders.map((header) => (
              <Tr>
                <Td />
                <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                  {header}
                </Th>

                {setups?.map((setup) => (
                  <Td isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>
                    {header === "Average Liked"
                      ? avgFormatter(
                          setup[1]?.["Average_Number_of_Items_Liked"]
                        )
                      : ""}
                    {header === "Subgroup" ? setup[5] : ""}
                    {header === "Number of Respondents" ? setup[4] : ""}
                    {header === "Average Reach"
                      ? valueFormatter(setup[1]?.["Reach"])
                      : ""}
                    {header === "Average Favorite"
                      ? valueFormatter(setup[1]?.["Favorite_Percentage"])
                      : ""}
                  </Td>
                ))}
              </Tr>
            ))}
          </Thead>
          <Thead>
            <Tr>
              <Th w={1}>#</Th>
              <Th>Claim</Th>
              {setups.map((i) => (
                <Td key={i} />
              ))}
              {/*{setups.map((setup, i) => [*/}
              {/*  <Th*/}
              {/*    textAlign={"center"}*/}
              {/*    boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}*/}
              {/*  >*/}
              {/*    Setup {i + 1}*/}
              {/*  </Th>,*/}
              {/*])}*/}
            </Tr>
          </Thead>
          <Tbody>
            {claims.map((claim, i) => (
              <Tr>
                <Th>{i + 1}</Th>
                <Td
                  boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                  // w={"40%"}
                  textAlign={"left"}
                >
                  {claim}
                </Td>
                {setups.map((setup) => (
                  <Td
                    w={"12%"}
                    h={"10%"}
                    textAlign={"center"}
                    boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}
                    style={
                      setup[3].includes(claim) &&
                      (setup[2]?.[claim]?.Summary_Metrics.Reach * 100).toFixed(
                        1
                      )
                        ? {
                            backgroundColor:
                              colorMode === "dark" ? "#A0AEC0" : "#EDF2F7",
                            boxShadow:
                              "inset -3px 0px 20px 0px rgba(0,0,0,0.50)",
                            color: "black",
                          }
                        : {
                            opacity: 0.7,
                            // boxShadow: "5px 0 6px -5px rgba(0,0,0,0.5)",
                          }
                    }
                  >
                    {setup[3].includes(claim)
                      ? (setup[2]?.[claim].Summary_Metrics.Reach * 100).toFixed(
                          1
                        ) + " %"
                      : setup[0]?.[claim] === "Offered"
                      ? "Already Offered"
                      : setup[0]?.[claim] === "Considered"
                      ? "Considered"
                      : setup[0]?.[claim] === "Excluded"
                      ? "Excluded"
                      : ""}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </>
  );
}

{
  /*summaryMetricKeys.map((summaryMetricKey) => (*/
}

{
  /*/*  <Tr>*/
}
{
  /*    <Td />*/
}
{
  /*    <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>*/
}
{
  /*      {metricRendering[summaryMetricKey].displayLabel}*/
}
{
  /*    </Th>*/
}
{
  /*    {setups.map((setup) => [*/
}
{
  /*      <Th isNumeric boxShadow={"5px 0 6px -5px rgba(0,0,0,0.5)"}>*/
}
{
  /*        {setup[1]?.[summaryMetricKey] ===*/
}
{
  /*        setup[1]?.["Average_Number_of_Items_Liked"]*/
}
{
  /*          ? avgFormatter(*/
}
{
  /*              setup[1]?.["Average_Number_of_Items_Liked"]*/
}
{
  /*            )*/
}
{
  /*          : valueFormatter(setup[1]?.[summaryMetricKey])}*/
}
{
  /*      </Th>,*/
}
{
  /*    ])}*/
}
{
  /*  </Tr>*/
}
{
  /*))}*/
}
