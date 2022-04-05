import React from "react";
import { Button, Box, HStack, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

function MaximizeReach() {
  return (
    <>
      <Box justify={"center"} align={"center"}>
        <Button size="lg">
          <HStack>
            <FontAwesomeIcon icon={faChartLine} />
            <Text>Maximize Reach</Text>
          </HStack>
        </Button>
      </Box>
    </>
  );
}

export default MaximizeReach;
