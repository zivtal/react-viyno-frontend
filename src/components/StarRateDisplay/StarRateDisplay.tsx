import React from "react";
import { StarRate } from "../StarRate/StarRate";

export const StarRateDisplay = ({
  rate,
  ratings,
}: {
  rate?: number;
  ratings?: number;
}) => {
  return rate && ratings ? (
    <div className="rate">
      <div className="avg">{rate.toFixed(1)}</div>
      <div className="more-info">
        <StarRate rate={rate} />
        <div className="num-ratings">{ratings} ratings</div>
      </div>
    </div>
  ) : null;
};
