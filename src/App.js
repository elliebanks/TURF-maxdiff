import React, { useEffect, useState } from "react";
import Main from "./Components/TURFpage";
import UploadFile from "./Components/UploadFile";

export const ClaimsContext = React.createContext(null);

const App = () => {
  const [claims, setClaims] = useState();

  const claimsData = React.useMemo(
    () => ({
      claims,
      setClaims,
    }),
    [claims, setClaims]
  );

  useEffect(function checkDbForProject() {
    if (claims === undefined) {
      fetch("/api/check_db_for_claims")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setClaims(data);
          // if project is found in database claims are set to the list of claims from the db
          // if project is not found in database claims are set to an empty list
        });
    }
  });

  return (
    <ClaimsContext.Provider value={claimsData}>
      {/*when claims are undefined while the browser is loading - based on the return from Check_DB hook:*/}
      {/*if the length of the claims list is 0 (an empty list) meaning no project was found in the db*/}
      {/*the browser will render the Upload File page - if the length of the claims list is greater than 0 */}
      {/* the browser will render the Main page with the Data Table filled with the list of claims*/}

      {claims === undefined ? (
        ""
      ) : claims.length === 0 ? (
        <UploadFile />
      ) : (
        <Main />
      )}

      {/*<Routes>*/}
      {/*  <Route path={"/"} element={<Main />} />*/}
      {/*  <Route path={"/upload"} element={<UploadFile />} />*/}
      {/*</Routes>*/}
    </ClaimsContext.Provider>
  );
};

export default App;
