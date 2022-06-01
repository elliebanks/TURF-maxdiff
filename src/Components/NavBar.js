import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import * as React from "react";
import { FiHelpCircle, FiMenu, FiSearch, FiSettings } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  });
  return (
    <Box
      as="section"
      pb={{
        base: "12",
        md: "12",
      }}
    >
      <Box
        as="nav"
        bg="bg-surface"
        boxShadow={useColorModeValue("sm", "sm-dark")}
      >
        <Container
        // py={{
        //   base: "3",
        //   lg: "4",
        // }}
        >
          <Flex justify="space-between">
            <HStack spacing="10">
              {isDesktop && (
                <ButtonGroup variant="ghost" spacing="1">
                  <Button>
                    <NavLink to={"/"}>Home</NavLink>
                  </Button>
                  <Button aria-current="page">Dashboard</Button>
                  <Button>
                    <NavLink to={"/upload"}> Upload Project</NavLink>
                  </Button>
                  <Button>
                    <NavLink to={"/register"}>Register</NavLink>
                  </Button>
                </ButtonGroup>
              )}
            </HStack>
            {isDesktop ? (
              <HStack spacing="4">
                <ButtonGroup variant="ghost" spacing="1">
                  <IconButton
                    icon={<FiSearch fontSize="1.25rem" />}
                    aria-label="Search"
                  />
                  <IconButton
                    icon={<FiSettings fontSize="1.25rem" />}
                    aria-label="Settings"
                  />
                  <IconButton
                    icon={<FiHelpCircle fontSize="1.25rem" />}
                    aria-label="Help Center"
                  />
                </ButtonGroup>
                <Avatar size={"sm"} />
              </HStack>
            ) : (
              <IconButton
                variant="ghost"
                icon={<FiMenu fontSize="1.25rem" />}
                aria-label="Open Menu"
              />
            )}
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
