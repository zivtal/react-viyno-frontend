import React from "react";
import { StarRateDisplay } from "../../../../../../../components/StarRateDisplay/StarRateDisplay";
import { tryRequire } from "../../../../../../../shared/helpers/require";
import { Wine } from "../../../../../models/wine.model";

export const ReviewStat = ({ wine }: { wine: Wine }): JSX.Element | null => {
  type ObjectKey = keyof typeof wine;

  if (!wine?.ratings) {
    return null;
  }

  const setRatingBar = (rating: string): number => {
    if (!parseInt(rating) || !wine?.ratings) {
      return 0;
    }

    return parseInt(rating) / wine.ratings;
  };

  const total = 5;
  return (
    <div className="review-statistics">
      <StarRateDisplay rate={wine.rate} ratings={wine.ratings} />
      <div className="saperate"></div>
      <div className="rate-line flex column ">
        {[...Array(total)].map((el, idx) => {
          const key = `rate${total - idx}` as ObjectKey;

          return (
            <div
              className="flex"
              style={{ marginBlockEnd: "20px" }}
              key={`STAT_SCALE_${idx}`}
            >
              <div className="stars flex">
                {[...Array(total - idx)].map((el, idx2) => (
                  <img
                    src={tryRequire("imgs/icons/single-star.svg")}
                    alt="star"
                    key={`IMG_STAT_${idx}_${idx2}`}
                  />
                ))}
              </div>

              <div className="background-bar">
                <div
                  className="background-fill"
                  style={{
                    width: setRatingBar(`${wine[key]}`) * 134 + "px",
                    height: "16px",
                  }}
                ></div>
              </div>

              <span>{`${wine[key]}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
