import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  chakra,
  Flex,
  FormControl,
  FormHelperText,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Link,
  Stack,
} from "@chakra-ui/react";

const UserLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar />
        <Heading>Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              // backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  {/*<InputLeftElement*/}
                  {/*  pointerEvents="none"*/}
                  {/*  children={<CFaUserAlt color="gray.300" />}*/}
                  {/*/>*/}
                  <Input type="email" placeholder="Email" />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  {/*<InputLeftElement*/}
                  {/*  pointerEvents="none"*/}
                  {/*  color="gray.300"*/}
                  {/*  children={<CFaLock color="gray.300" />}*/}
                  {/*/>*/}
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>Forgot Password?</Link>
                </FormHelperText>
              </FormControl>
              <Button
                // borderRadius={0}
                type="submit"
                variant="solid"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Link style={{ fontWeight: "bold" }} href="#">
          Register Here!
        </Link>
      </Box>
    </Flex>
  );
};

export default UserLogin;
