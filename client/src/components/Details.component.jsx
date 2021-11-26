import React from "react";
import { countDetails } from "../utils";

const Details = ({ data }) => {
  const dataDetails = countDetails(data);
  return (
    <div style={{ display: "block", width: "100%" }}>
      <div>
        {`計胚${dataDetails.embryoSum}個`}
        <br></br>
        {`(内融解済 ${dataDetails.thawSum}個、残り${dataDetails.distance}個)`}
      </div>
    </div>
  );
};

export default Details;
