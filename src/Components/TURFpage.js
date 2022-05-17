import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import DataTable from "./DataTable";
import PrevSimSummary from "./PrevSimSummary";
import Graph from "./LineChart";
import ErrorModal from "./Custom Utils/ErrorModal";
import { ClaimsContext } from "../App";
import {
  AddIcon,
  ChevronDownIcon,
  DeleteIcon,
  DownloadIcon,
  PlusSquareIcon,
} from "@chakra-ui/icons";
import { TabContext, ReachContext } from "./RunTurf";

export const CheckboxContext = React.createContext(null);
export const SummaryContext = React.createContext(null);
export const SetupContext = React.createContext(null);
export const SelectedSubgroupContext = React.createContext(null);

const TURFpage = () => {
  // STATE VARIABLES
  const { claims, setClaims } = React.useContext(ClaimsContext);
  const [reach, setReach] = useState();
  const [favorite, setFavorite] = useState();
  const [summaryMetrics, setSummaryMetrics] = useState({
    1: 0.0,
    2: 0.0,
    3: 0.0,
  });
  const [selectedSubgroup, setSelectedSubgroup] = React.useState("Total");

  const [numberOfSubgroupRespondents, setNumberOfSubgroupRespondents] =
    React.useState(0);

  const [claimState, setClaimState] = React.useState(
    Object.fromEntries(claims.map((claim) => [claim, "Considered"]))
  );

  const [tabIndex, setTabIndex] = React.useState(0);
  const [orderOfItems, setOrderOfItems] = React.useState([]);
  const [incrementalReachSummary, setIncrementalReachSummary] = React.useState(
    {}
  );

  const [isOpen, setIsOpen] = React.useState(false); // state property for Error Modal

  // DELETE PROJECT AND SETUP ERROR MODAL
  function onClose() {
    // onClose function passed to ErrorModal
    setClaims([]); // when ErrorModal close button is clicked claims are set to [] => redirect to Upload File page
    setIsOpen(false); // ErrorModal is removed
  }

  const toast = useToast();
  const handleDelete = () => {
    let status = 0;
    fetch("/api/project", { method: "DELETE" }) // handleDelete function goes to backend to check for project in db
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        if (status === 400) {
          setIsOpen(true); // if no project is found error status is returned and ErrorModal is displayed
        } else {
          console.log(data);
          toast({
            title: "Success!",
            description: "Project was deleted.",
            status: "success",
            isClosable: true,
          });
          setSubgroupFilter(data);
          setClaims(data); // if project is found - project is deleted from db and claims are set to [] => redirect to Upload File page
        }
      });
  };

  // CALCULATE AND DISPLAY REACH SCORES
  useEffect(
    function requestMDReachScores() {
      fetch("/api/request_maxdiff_reach_scores", {
        method: "POST",
        body: JSON.stringify({ claims }),
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
    [claims]
  );

  // FILTER FOR OFFERED CLAIMS AND CONSIDERED CLAIMS
  const offeredClaims = React.useMemo(() => {
    // sets claim object to an array so that we can filter out the states that are considered/excluded
    const claimStateArray = Object.entries(claimState);
    // filter the array of claims and their state values
    // take each claim that is in the 'offered' column (state) and put those claims into an array
    const allCurrentOfferingsArray = claimStateArray.filter(
      ([claim, stateValue]) => stateValue === "Offered"
    );
    // console.log(allCurrentOfferingsArray);
    // we need to work with an object, so turn the array of offered claims back to an object
    // so we can send an object to our get summary metrics route
    return Object.fromEntries(allCurrentOfferingsArray);
  }, [claimState]);

  const consideredClaims = React.useMemo(() => {
    // sets claim object to an array so that we can filter out the states that are considered/excluded
    const claimStateArray = Object.entries(claimState);
    // filter the array of claims and their state values
    // take each claim that is in the 'offered' column (state) and put those claims into an array
    const allConsideredClaimsArray = claimStateArray.filter(
      ([claim, stateValue]) => stateValue === "Considered"
    );
    // console.log(allConsideredClaimsArray);
    // we need to work with an object, so turn the array of offered claims back to an object
    // so we can send an object to our get summary metrics route
    return Object.fromEntries(allConsideredClaimsArray);
  }, [claimState]);

  // DISPLAY SUMMARY METRICS OF OFFERED CLAIMS
  useEffect(
    function requestMDSummaryMetrics() {
      fetch("/api/request_maxdiff_summary_metrics", {
        method: "POST",
        body: JSON.stringify(offeredClaims),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSummaryMetrics(data["Summary_Metrics"]);
        });
    },
    [offeredClaims]
  );
  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  // ADD SETUP TO SIDE BY SIDE PAGE
  const [setups, setSetups] = React.useState([]);

  const handleAddSetup = () => {
    const newSetup = [
      claimState,
      summaryMetrics,
      incrementalReachSummary,
      orderOfItems,
      numberOfSubgroupRespondents,
      selectedSubgroup,
    ];
    setSetups((prevSetups) => [...prevSetups, newSetup]);
    toast({
      title: "Success!",
      description: "Setup was added.",
      isClosable: true,
      status: "success",
    });
    setTabIndex(2);
  };

  const handleChartExport = () => {
    fetch("/api/export_chart_to_csv", {
      method: "POST",
      body: JSON.stringify({
        orderOfItems,
        incrementalReachSummary,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        // use of .then promise - waiting for response from the backend
        return res.blob(); // return response for Excel file from backend
        //  return res.json() // for json
      })
      .then((data) => {
        // data received from the backend
        console.log(data);
        // download file
        const href = window.URL.createObjectURL(data);
        const a = document.createElement("a");
        a.download = `TURF_Chart_Simulation.csv`;
        a.href = href;
        a.click();
        a.href = "";
      });
  };

  const [subgroupFile, setSubgroupFile] = useState();

  const [subgroupFileSelected, setSubgroupFileSelected] = useState(false);

  const [subgroupFilter, setSubgroupFilter] = React.useState([]);
  const subgroupInputRef = useRef(null);
  const handleSubgroupFile = (event) => {
    setSubgroupFile(event.target.files[0]);
    setSubgroupFileSelected(true);
    console.log(event.target.files[0]);
  };

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
        toast({
          title: "Success!",
          description: "Subgroup File was uploaded.",
          isClosable: true,
          status: "success",
        });

        // sets list of claims to the claims from the uploaded Excel file
      })
      .finally(() => {
        // give regular mouse cursor back
        document.body.style.cursor = "default";
      });
  };

  const handleDeleteTURFChart = () => {
    setOrderOfItems([]);
    setIncrementalReachSummary({});
    setTabIndex(0);
    toast({
      title: "Success!",
      description: "TURF Chart was deleted.",
      isClosable: true,
      status: "success",
    });
  };

  const setupData = React.useMemo(
    () => ({
      setups,
      setSetups,
    }),
    [setups, setSetups]
  );

  // CONTEXT DATA
  const checkboxData = React.useMemo(
    () => ({
      claimState,
      setClaimState,
    }),
    [claimState, setClaimState]
  );

  const summaryData = React.useMemo(
    () => ({
      reach,
      favorite,
      summaryMetrics,
      setSummaryMetrics,
      setReach,
      setFavorite,
      offeredClaims,
      consideredClaims,
    }),
    [
      reach,
      favorite,
      summaryMetrics,
      setSummaryMetrics,
      setReach,
      setFavorite,
      offeredClaims,
    ]
  );

  const reachData = React.useMemo(
    () => ({
      orderOfItems,
      incrementalReachSummary,
      setOrderOfItems,
      setIncrementalReachSummary,
      tabIndex,
      setTabIndex,
    }),
    [
      orderOfItems,
      incrementalReachSummary,
      tabIndex,
      setTabIndex,
      setOrderOfItems,
      setIncrementalReachSummary,
    ]
  );

  const selectedSubgroupData = React.useMemo(
    () => ({
      setSubgroupFilter,
      subgroupFilter,
      numberOfSubgroupRespondents,
      setNumberOfSubgroupRespondents,
      selectedSubgroup,
      setSelectedSubgroup,
    }),
    [
      setSubgroupFilter,
      subgroupFilter,
      numberOfSubgroupRespondents,
      setNumberOfSubgroupRespondents,
      selectedSubgroup,
      setSelectedSubgroup,
    ]
  );

  const tabData = React.useMemo(
    () => ({ tabIndex, setTabIndex }),
    [tabIndex, setTabIndex]
  );
  console.log(orderOfItems);

  return (
    <CheckboxContext.Provider value={checkboxData}>
      <SummaryContext.Provider value={summaryData}>
        <SetupContext.Provider value={setupData}>
          <ReachContext.Provider value={reachData}>
            <SelectedSubgroupContext.Provider value={selectedSubgroupData}>
              {/*<SubgroupContext.Provider value={subgroupData}>*/}
              <TabContext.Provider value={tabData}>
                <Tabs
                  variant={"enclosed"}
                  index={tabIndex}
                  onChange={handleTabChange}
                >
                  <TabList>
                    <Tab tabIndex={0}> TURF Simulation</Tab>
                    {orderOfItems?.length > 0 ? (
                      <Tab tabIndex={1}>TURF Chart</Tab>
                    ) : (
                      ""
                    )}
                    {setups?.length > 0 ? (
                      <Tab tabIndex={2}>Previous Simulation Summary</Tab>
                    ) : (
                      ""
                    )}
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      {" "}
                      <Menu float={"right"}>
                        <MenuButton
                          // isActive={isOpen}
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                          // display={"flex"}
                          // float={"right"}
                        >
                          Simulator Options
                        </MenuButton>
                        <MenuList>
                          <input
                            name={"file"}
                            type={"file"}
                            accept={".xlsx, .xls"}
                            ref={subgroupInputRef}
                            onChange={handleSubgroupFile}
                            hidden
                          />
                          <MenuItem
                            icon={<PlusSquareIcon />}
                            onClick={() => subgroupInputRef.current.click()}
                          >
                            {" "}
                            Upload Subgroup File{"    "}{" "}
                          </MenuItem>
                          <MenuItem
                            onClick={handleDelete}
                            icon={<DeleteIcon />}
                          >
                            Delete Project
                          </MenuItem>
                        </MenuList>
                      </Menu>
                      {subgroupFileSelected ? (
                        <Button size={"xs"} onClick={handleSubgroupSubmission}>
                          Submit Subgroup File
                        </Button>
                      ) : (
                        ""
                      )}
                      <ErrorModal isOpen={isOpen} onClose={onClose} />{" "}
                      <DataTable />
                    </TabPanel>

                    {orderOfItems?.length > 0 ? (
                      <TabPanel>
                        <Menu align={"right"} marginBottom={12}>
                          <MenuButton
                            // isActive={isOpen}
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            // display={"flex"}
                            // float={"right"}
                          >
                            TURF Chart Options
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              onClick={handleChartExport}
                              icon={<DownloadIcon />}
                            >
                              Download as CSV
                            </MenuItem>
                            <MenuItem
                              onClick={handleAddSetup}
                              icon={<AddIcon />}
                            >
                              Add to Previous Simulation Summary
                            </MenuItem>
                            <MenuItem
                              onClick={handleDeleteTURFChart}
                              icon={<DeleteIcon />}
                            >
                              Delete Chart
                            </MenuItem>
                          </MenuList>
                        </Menu>

                        <Graph />
                      </TabPanel>
                    ) : (
                      ""
                    )}
                    <TabPanel>
                      <PrevSimSummary />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </TabContext.Provider>
              {/*</SubgroupContext.Provider>*/}
            </SelectedSubgroupContext.Provider>
          </ReachContext.Provider>
        </SetupContext.Provider>
      </SummaryContext.Provider>
    </CheckboxContext.Provider>
  );
};

export default TURFpage;
