import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  Input,
  LightMode,
  NumberInput,
  Select,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import DataTable from "./DataTable";
import SideBySidePage from "./SideBySidePage";
import Graph from "./LineChart";
import ErrorModal from "./Custom Utils/ErrorModal";
import SummaryMetrics from "../Top Level Components/SummaryMetrics";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { ClaimsContext } from "../App";

export const CheckboxContext = React.createContext(null);
export const SummaryContext = React.createContext(null);
export const SetupContext = React.createContext(null);
export const ReachContext = React.createContext(null);

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
  const [claimState, setClaimState] = React.useState(
    Object.fromEntries(claims.map((claim) => [claim, "Considered"]))
  );
  const [isOpen, setIsOpen] = React.useState(false); // state property for Error Modal

  // set state and onchange handler for # of considered claims the user would like to offer
  const [numberOfItemsToTurnOn, setNumberOfItemsToTurnOn] = React.useState(1);

  const handleNumberInput = (numberOfItemsToTurnOn) =>
    setNumberOfItemsToTurnOn(numberOfItemsToTurnOn);

  // set state and handler for redirecting to TURF chart tab when max reach button is clicked
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabChange = (index) => {
    setTabIndex(index);
  };

  // DELETE PROJECT AND SETUP ERROR MODAL
  function onClose() {
    // onClose function passed to ErrorModal
    setClaims([]); // when ErrorModal close button is clicked claims are set to [] => redirect to Upload File page
    setIsOpen(false); // ErrorModal is removed
  }

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
          setClaims(data); // if project is found - project is deleted from db and claims are set to [] => redirect to Upload File page
        }
      });
  };

  // CALCULATE AND DISPLAY REACH SCORES
  useEffect(
    function getReachScores() {
      fetch("/api/get_reach_scores", {
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
    console.log(allCurrentOfferingsArray);
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
    console.log(allConsideredClaimsArray);
    // we need to work with an object, so turn the array of offered claims back to an object
    // so we can send an object to our get summary metrics route
    return Object.fromEntries(allConsideredClaimsArray);
  }, [claimState]);

  // DISPLAY SUMMARY METRICS OF OFFERED CLAIMS
  useEffect(
    function getSummaryMetrics() {
      fetch("/api/get_summary_metrics", {
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

  // MAXIMIZE REACH FUNCTION
  const maximizeReachData = {
    claimsOn: offeredClaims,
    claimsConsidered: consideredClaims,
    numberItemsTurnOn: numberOfItemsToTurnOn,
  };

  const [orderOfItems, setOrderOfItems] = React.useState([]);
  const [incrementalReachSummary, setIncrementalReachSummary] = React.useState(
    {}
  );
  const handleClaimStateChange = (claim, newValue) => {
    setClaimState((prev) => {
      const newClaimState = { ...prev, [claim]: newValue };
      console.log({ [claim]: newValue });
      return newClaimState;
    });
  };

  function handleMaximizeReach() {
    let status = 0;
    fetch("/api/calc_incremental_reach", {
      method: "POST",
      body: JSON.stringify(maximizeReachData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setOrderOfItems(data["Order of Items"]);
        setIncrementalReachSummary(data["Incremental Reach Summary"]);
        setTabIndex(1); // redirects to the TURF chart tab panel
      });
  }
  useEffect(() => {
    for (let claim of orderOfItems) {
      handleClaimStateChange(claim, "Offered");
    }
  }, [orderOfItems]);

  // ADD SETUP TO SIDE BY SIDE PAGE
  const [setups, setSetups] = React.useState([]);

  const toast = useToast();

  const handleAddSetup = () => {
    const newSetup = [
      claimState,
      summaryMetrics,
      incrementalReachSummary,
      orderOfItems,
    ];
    setSetups((prevSetups) => [...prevSetups, newSetup]);
    toast({
      title: "Success!",
      description: "Setup was added.",
      isClosable: true,
      status: "success",
    });
  };

  // CONTEXT DATA
  const checkboxData = React.useMemo(
    () => ({
      claimState,
      setClaimState,
    }),
    [claimState, setClaimState]
  );

  const summaryData = React.useMemo(
    () => ({ reach, favorite, summaryMetrics, setSummaryMetrics }),
    [reach, favorite, summaryMetrics, setSummaryMetrics]
  );

  const setupData = React.useMemo(
    () => ({
      setups,
      setSetups,
    }),
    [setups, setSetups]
  );

  const reachData = React.useMemo(
    () => ({
      orderOfItems,
      incrementalReachSummary,
    }),
    [orderOfItems, incrementalReachSummary]
  );

  return (
    <CheckboxContext.Provider value={checkboxData}>
      <SummaryContext.Provider value={summaryData}>
        <SetupContext.Provider value={setupData}>
          <ReachContext.Provider value={reachData}>
            <Tabs
              variant={"enclosed"}
              index={tabIndex}
              onChange={handleTabChange}
            >
              <TabList>
                <Tab tabIndex={0}>Data Table</Tab>
                {orderOfItems === undefined ? null : (
                  <Tab tabIndex={1}>TURF Chart</Tab>
                )}{" "}
                {/*TURF Chart tab will only display if the orderOfItems state is*/}
                {/*defined (which occurs on max reach button click)*/}
                <Tab tabIndex={2}>Side By Side</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {" "}
                  <HStack spacing={4}>
                    <Button type={"submit"} size={"md"} onClick={handleDelete}>
                      <HStack>
                        <FontAwesomeIcon icon={faTrashCan} />
                        <Text>Delete Project</Text>
                      </HStack>
                    </Button>
                  </HStack>
                  <ErrorModal isOpen={isOpen} onClose={onClose} />{" "}
                  <VStack spacing={10} m={10} p={4}>
                    <HStack spacing={2}>
                      <HStack spacing={4}>
                        <Text>Number of Claims You Would Like To Offer: </Text>
                        <NumberInput
                          width={"15%"}
                          defaultValue={5}
                          min={1}
                          max={claims.length - 1}
                          value={numberOfItemsToTurnOn}
                          onChange={handleNumberInput}
                          errorBorderColor={"red.500"}
                          inputMode={"numeric"}
                          isRequired={true}
                          size={"sm"}
                          // onChange={(e) =>
                          //    setNumberOfItemsToTurnOn(e.target.value)
                          //  }
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </HStack>
                      <Button size="md" onClick={handleMaximizeReach}>
                        <HStack>
                          <FontAwesomeIcon icon={faChartLine} />
                          <Text>Maximize Reach</Text>
                        </HStack>
                      </Button>
                    </HStack>
                    <DataTable />
                  </VStack>
                </TabPanel>
                {orderOfItems === undefined ? (
                  ""
                ) : (
                  <TabPanel align={"center"}>
                    <VStack>
                      <Graph />
                      <Button
                        size={"lg"}
                        type={"submit"}
                        onClick={handleAddSetup}
                      >
                        <HStack align={"flex-end"}>
                          <FontAwesomeIcon icon={faPlus} />
                          <Text>Add Setup to Side by Side View</Text>
                        </HStack>
                      </Button>
                    </VStack>
                  </TabPanel>
                )}
                <TabPanel>
                  <SideBySidePage />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ReachContext.Provider>
        </SetupContext.Provider>
      </SummaryContext.Provider>
    </CheckboxContext.Provider>
  );
};

export default TURFpage;
