import React, { useEffect, useState } from "react";
import Main from "./Components/TURFpage";
import UploadFile from "./Components/UploadFile";
import {
  BrowserRouter,
  Routes,
  BrowserRouter as Router,
  NavLink,
  Route,
} from "react-router-dom";
import {
  ChakraProvider,
  Container,
  HStack,
  Link,
  StackDivider,
  Switch,
} from "@chakra-ui/react";
import UserLogin from "./Pages/UserLogin";
import TURFpage from "./Components/TURFpage";
import NavBar from "./Components/NavBar";
import UserRegistration from "./Pages/UserRegistration";

export const ClaimsContext = React.createContext(null);

const App = () => {
  const [claims, setClaims] = React.useState([]);

  // const NavBar = () => (
  //   <HStack spacing={3} divider={<StackDivider />} as={"nav"}>
  //     <NavLink to={"/"}>Home</NavLink>
  //     <NavLink to={"/login"}>Login</NavLink>
  //     <NavLink to={"/upload"}>Upload File</NavLink>
  //   </HStack>
  // );

  const claimsData = React.useMemo(
    () => ({
      claims,
      setClaims,
    }),
    [claims, setClaims]
  );

  return (
    <ClaimsContext.Provider value={claimsData}>
      <Container maxWidth={"100%"}>
        <NavBar />
        <Routes>
          <Route path={"/"} element={<TURFpage />} />
          <Route path={"/login"} element={<UserLogin />} />
          <Route path={"/upload"} element={<UploadFile />} />
          <Route path={"/register"} element={<UserRegistration />} />
          {/*<Route path={"*"} element={<Navigate to="/" />} />*/}
        </Routes>
      </Container>
    </ClaimsContext.Provider>
  );
};

export default App;

{
  /*when claims are undefined while the browser is loading - based on the return from Check_DB hook:*/
}
{
  /*if the length of the claims list is 0 (an empty list) meaning no project was found in the db*/
}
{
  /*the browser will render the Upload File page - if the length of the claims list is greater than 0 */
}
{
  /* the browser will render the Main page with the Data Table filled with the list of claims*/
}

{
  /*{claims === undefined ? (*/
}
{
  /*  ""*/
}
{
  /*) : claims.length === 0 ? (*/
}
{
  /*  <UploadFile />*/
}
{
  /*) : (*/
}
{
  /*  <Main />*/
}
{
  /*)}*/
}
