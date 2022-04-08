import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  useCheckboxGroup,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useToast,
  useRadioGroup,
  Input,
} from "@chakra-ui/react";
import DataTable from "./DataTable";
import { ClaimsContext } from "../App";
import ErrorModal from "./ErrorModal";
import SummaryMetrics from "../Top Level Components/SummaryMetrics";
import MaximizeReach from "../Top Level Components/MaximizeReach";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import SideBySidePage from "./SideBySidePage";

export const CheckboxContext = React.createContext(null);
export const SummaryContext = React.createContext(null);
export const SetupContext = React.createContext(null);

const TURFpage = () => {
  // STATE VARIABLES
  const [reach, setReach] = useState();
  const [favorite, setFavorite] = useState();
  const [summaryMetrics, setSummaryMetrics] = useState({
    1: 0.0,
    2: 0.0,
    3: 0.0,
  });
  const { claims, setClaims } = React.useContext(ClaimsContext);
  const [claimState, setClaimState] = React.useState(
    Object.fromEntries(claims.map((claim) => [claim, "Considered"]))
  );
  const [isOpen, setIsOpen] = React.useState(false); // state property for Error Modal

  const [numberOfItemsToTurnOn, setNumberOfItemsToTurnOn] = React.useState("");
  console.log(numberOfItemsToTurnOn);

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

  // CALCULATE AND PULL REACH SCORES
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

  // FILTER FOR OFFERED CLAIMS SO WE CAN GET SUMMARY METRICS FOR THOSE CLAIMS
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
  console.log(consideredClaims);

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

  const maximizeReachData = {
    claimsOn: offeredClaims,
    claimsConsidered: consideredClaims,
    numberItemsTurnOn: numberOfItemsToTurnOn,
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
        console.log(data);
      });
  }

  // ADD SETUP TO SIDE BY SIDE PAGE
  const [setups, setSetups] = React.useState([]);

  const toast = useToast();

  const handleAddSetup = () => {
    const newSetup = [claimState, summaryMetrics];
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

  return (
    <CheckboxContext.Provider value={checkboxData}>
      <SummaryContext.Provider value={summaryData}>
        <SetupContext.Provider value={setupData}>
          <Tabs>
            <TabList>
              <Tab>Data Table</Tab>
              <Tab>Side by Side</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {" "}
                <HStack spacing={4}>
                  <Button size={"lg"} type={"submit"} onClick={handleAddSetup}>
                    <HStack>
                      <FontAwesomeIcon icon={faPlus} />
                      <Text>Add Setup to Side by Side View</Text>
                    </HStack>
                  </Button>
                  <Button type={"submit"} size={"lg"} onClick={handleDelete}>
                    <HStack>
                      <FontAwesomeIcon icon={faTrashCan} />
                      <Text>Delete Project</Text>
                    </HStack>
                  </Button>
                </HStack>
                <ErrorModal isOpen={isOpen} onClose={onClose} />{" "}
                <VStack spacing={10} m={10} p={4}>
                  <SummaryMetrics />
                  <Button size="lg" onClick={handleMaximizeReach}>
                    <HStack>
                      <FontAwesomeIcon icon={faChartLine} />
                      <Text>Maximize Reach</Text>
                    </HStack>
                  </Button>
                  <HStack float={"left"}>
                    <Text>
                      Number of Considered Claims You Would Like To Offer:{" "}
                    </Text>
                    <Input
                      textAlign={"center"}
                      value={numberOfItemsToTurnOn}
                      onChange={(e) => setNumberOfItemsToTurnOn(e.target.value)}
                      placeholder="1"
                      size="sm"
                      w={"20%"}
                    />
                  </HStack>
                  <DataTable />
                </VStack>
              </TabPanel>

              <TabPanel>
                <SideBySidePage />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </SetupContext.Provider>
      </SummaryContext.Provider>
    </CheckboxContext.Provider>
  );
};

export default TURFpage;
