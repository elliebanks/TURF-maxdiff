import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ReachContext } from "./TURFpage";

export default function Graph() {
  const { orderOfItems, incrementalReachSummary } =
    React.useContext(ReachContext);

  const data = React.useMemo(() => {
    return orderOfItems?.map((claim) => ({
      name: claim,
      value: incrementalReachSummary[claim]?.Summary_Metrics.Reach * 100,
    }));
  }, [orderOfItems, incrementalReachSummary]);

  const json = {
    "Order of Items": [
      "Challenges my thinking by providing different perspectives I might not otherwise have considered or known about",
      "Helps me relax and unwind",
    ],

    "Incremental Reach Summary": {
      "Challenges my thinking by providing different perspectives I might not otherwise have considered or known about":
        {
          Claim_Reach: {
            "Has hosts that are credible / experienced": 0.4259094942324756,
            "Has hosts that I identify and connect with ": 0.30612244897959184,
            "Has hosts with great personalities and/or chemistry with co-hosts and guests": 0.44809228039041704,
            "Challenges my thinking by providing different perspectives I might not otherwise have considered or known about": 0.5093167701863354,
          },
          Claim_Favorite: {
            "Has hosts that are credible / experienced": 0.05146406388642413,
            "Has hosts that I identify and connect with ": 0.04259094942324756,
            "Has hosts with great personalities and/or chemistry with co-hosts and guests": 0.06743566992014197,
            "Challenges my thinking by providing different perspectives I might not otherwise have considered or known about": 0.06921029281277728,
          },
          Summary_Metrics: {
            Average_Number_of_Items_Liked: 1.68944099378882,
            Reach: 0.8793256433007985,
            Favorite_Percentage: 0.23070097604259093,
          },
        },

      "Helps me relax and unwind": {
        Claim_Reach: {
          "Has hosts that are credible / experienced": 0.4259094942324756,
          "Has hosts that I identify and connect with ": 0.30612244897959184,
          "Has hosts with great personalities and/or chemistry with co-hosts and guests": 0.44809228039041704,
          "Challenges my thinking by providing different perspectives I might not otherwise have considered or known about": 0.5093167701863354,
          "Helps me relax and unwind": 0.3460514640638864,
        },
        Claim_Favorite: {
          "Has hosts that are credible / experienced": 0.05146406388642413,
          "Has hosts that I identify and connect with ": 0.04259094942324756,
          "Has hosts with great personalities and/or chemistry with co-hosts and guests": 0.06743566992014197,
          "Challenges my thinking by providing different perspectives I might not otherwise have considered or known about": 0.06921029281277728,
          "Helps me relax and unwind": 0.07808340727595386,
        },
        Summary_Metrics: {
          Average_Number_of_Items_Liked: 2.0354924578527065,
          Reach: 0.935226264418811,
          Favorite_Percentage: 0.3087843833185448,
        },
      },
    },
  };

  //     [
  //   {
  //     name: "yaya", //claim
  //     value: 500, // reach
  //   },
  // ];
  return (
    // <ResponsiveContainer width="100%" height="100%">
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="value"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
    </LineChart>
    // </ResponsiveContainer>
  );
}
