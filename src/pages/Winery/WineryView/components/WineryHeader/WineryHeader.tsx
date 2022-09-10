import React from "react";
import { tryRequire } from "../../../../../shared/helpers/require";
import { BaseProps } from "../../../../../shared/models/base-props";
import { Winery } from "../../../models/winery.model";
import StringService from "../../../../../shared/services/string.service";

interface Props extends BaseProps {
  winery?: Winery;
  winesCount?: number;
}

const WineryRating = (props: Props): JSX.Element | null => {
  if (!props.winery) {
    return null;
  }

  return props.winery?.rate || props.winery?.ratings ? (
    <div className="average-rate">
      <p>Average Rating</p>
      <p className="rate">
        {props.winery?.rate ? (
          <span>{props.winery.rate.toFixed(1)} </span>
        ) : null}
        {props.winery?.ratings ? (
          <span>{props.winery.ratings} Ratings</span>
        ) : null}
      </p>
    </div>
  ) : null;
};

const WineryMap = (props: Props): JSX.Element => {
  const rtl = document.dir === "rtl";
  const headerStyle =
    (!props.winery?.latitude || !props.winery?.longitude) &&
    !props.winery?.image
      ? { margin: `24px 0`, height: `auto` }
      : {};

  return (
    <div
      className={`winery-map ${rtl ? "header-wave-rtl" : "header-wave"}`}
      style={headerStyle}
    >
      {props.winery?.latitude && props.winery?.longitude ? (
        <iframe
          src={`https://maps.google.com/maps?q=${props.winery?.latitude},${props.winery?.longitude}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
          width="100%"
          height="100%"
          // frameBorder="0"
          // allowFullScreen="0"
        ></iframe>
      ) : null}
    </div>
  );
};

export function WineryHeader(props: Props): JSX.Element | null {
  const { winesCount } = props;

  const data = props.winery;

  if (!data) {
    return null;
  }

  return (
    <header className="winery-header full">
      <div className="cover"></div>
      {data?.image ? <img className="cover" src={data?.image} /> : null}
      <WineryMap winery={data} />
      <div className="winery-information fit-media">
        <p className="title">winery</p>
        <h1 className="name">{data?.name}</h1>
        {data?.country ? (
          <div className="country">
            <img
              src={tryRequire(
                `imgs/icons/country/${StringService.toKebabCase(
                  data?.country,
                  true
                )}.png`
              )}
            />
            <p>
              {data?.region ? data?.region + ", " : ""}
              {data?.country}
            </p>
          </div>
        ) : null}
        <div className="more-information">
          <WineryRating winery={data} />

          <div className="wines-count">
            <p>Wines</p>
            <p>{data?.wines || winesCount}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
