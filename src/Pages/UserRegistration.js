import React from "react";

import {
  Button,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";

export default function UserRegistration() {
  return (
    <Container
      maxW="md"
      py={{
        base: "12",
        md: "12",
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6" align="center">
          <Stack spacing="3" textAlign="center">
            <Heading
              size={useBreakpointValue({
                base: "xs",
                md: "md",
              })}
            >
              Create Account
            </Heading>
          </Stack>
        </Stack>
        <Stack spacing="6">
          <Stack spacing="5">
            <FormControl isRequired>
              <FormLabel htmlFor="name">Name</FormLabel>
              <Input id="name" type="text" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" type="email" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" type="password" />
              <FormHelperText color="muted">
                At least 8 characters long
              </FormHelperText>
            </FormControl>
          </Stack>
          <Stack spacing="4">
            <Button>Create account</Button>
          </Stack>
        </Stack>
        <HStack justify="center" spacing="1">
          <Text fontSize="sm" color="muted">
            Already have an account?
          </Text>
          <Button variant="link" style={{ fontWeight: "bold" }} size="sm">
            Log in
          </Button>
        </HStack>
      </Stack>
    </Container>
  );
}
