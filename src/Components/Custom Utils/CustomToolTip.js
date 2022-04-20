import React from "react";
import { useColorMode } from "@chakra-ui/react";
import "../../Styles/chartStyles.css";

const CustomToolTip = ({ active, payload }) => {
  const { colorMode } = useColorMode();
  if (!active) {
    return null;
  }

  const properties = payload[0].payload;

  return (
    <div
      className={"tooltip"}
      style={{
        backgroundColor:
          colorMode === "dark" ? "rgba(26,32,44,0.92)" : "rgb(237,242,247)",
        color: colorMode === "dark" ? "#FFFFFFEB" : "#1A202C",
        fillOpacity: 0.5,
      }}
    >
      <h4>
        {" "}
        <strong>Claim :</strong> {properties.Claim}
      </h4>
      <p>
        <strong>Optimized Reach :</strong> {properties.Reach} %
      </p>
    </div>
  );
};
export default CustomToolTip;
