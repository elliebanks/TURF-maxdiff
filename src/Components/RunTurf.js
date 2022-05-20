import React, { useEffect } from "react";
import { CheckboxContext, SummaryContext } from "./TURFpage";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  CloseButton,
  Container,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { ClaimsContext } from "../App";

export const TabContext = React.createContext(0);
export const ReachContext = React.createContext();

const RunTurf = () => {
  const { claims } = React.useContext(ClaimsContext);
  const { setClaimState } = React.useContext(CheckboxContext);
  const { offeredClaims, consideredClaims } = React.useContext(SummaryContext);

  const {
    setOrderOfItems,
    orderOfItems,
    setIncrementalReachSummary,
    incrementalReachSummary,
  } = React.useContext(ReachContext);

  const { setTabIndex, tabIndex } = React.useContext(TabContext);

  // set state and onchange handler for # of considered claims the user would like to offer
  const [numberOfItemsToTurnOn, setNumberOfItemsToTurnOn] = React.useState(1);

  const handleNumberInput = (numberOfItemsToTurnOn) =>
    setNumberOfItemsToTurnOn(numberOfItemsToTurnOn);

  // MAXIMIZE REACH FUNCTION
  const maximizeReachData = {
    claimsOn: offeredClaims,
    claimsConsidered: consideredClaims,
    numberItemsTurnOn: numberOfItemsToTurnOn,
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

  const toast = useToast();

  const [error, setError] = React.useState(null);

  function handleMaximizeReach() {
    let status = 0;
    fetch("/api/calc_incremental_reach", {
      method: "POST",
      body: JSON.stringify(maximizeReachData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((data) => {
        if (status === 500) {
          setError(data.message);
          setTimeout(() => setError(null), 7000);
        } else {
          setTimeout(() => setOrderOfItems(data["Order of Items"]), 0.1);
          setTimeout(
            () => setIncrementalReachSummary(data["Incremental Reach Summary"]),
            0.1
          );
          setTabIndex(1); // redirects to the TURF chart tab panel
        }
      });
  }

  useEffect(() => {
    console.log(error);
  }, [error]);

  useEffect(() => {
    console.log(orderOfItems);
    if (orderOfItems) {
      for (let claim of orderOfItems) {
        handleClaimStateChange(claim, "Offered");
      }
    }
  }, [orderOfItems]);

  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <VStack spacing={4}>
      {error ? (
        <Alert
          status="error"
          justifyContent={"center"}
          width={"fit-content"}
          borderRadius={"5px"}
        >
          <AlertIcon />
          {error}
          <CloseButton
            size={"sm"}
            alignSelf="flex-start"
            position="relative"
            right={-2}
            top={-2}
            onClick={handleErrorClose}
          />
        </Alert>
      ) : null}
      <HStack spacing={2}>
        <HStack spacing={4} float={"right"}>
          <Text>
            Number of Claims You Would Like to Add to Current Offerings:{" "}
          </Text>
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
            <Text>Run TURF</Text>
          </HStack>
        </Button>
      </HStack>
    </VStack>
  );
};

export default RunTurf;
