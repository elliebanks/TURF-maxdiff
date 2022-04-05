import { Checkbox, useCheckbox } from "@chakra-ui/react";
import React from "react";

export default function GroupCheckbox(props) {
  const {} = useCheckbox(props);

  return <Checkbox {...props} />;
}
