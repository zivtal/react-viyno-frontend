import React from "react";
import { tryRequire } from "../../../../../services/require.service";
import { toKebabCase } from "../../../../../services/dev.service";

export function WineryHeader(props) {
  const rtl = document.dir === "rtl";
  const { winery, winesCount } = props;

  const data = props.winery;

  if (!data) {
    return;
  }

  const WineryMap = ({ winery }) => {
    const headerStyle =
      (!winery?.lat || !winery?.lng) && !winery?.image
        ? { margin: `24px 0`, height: `auto` }
        : {};

    return (
      <div
        className={`winery-map ${rtl ? "header-wave-rtl" : "header-wave"}`}
        style={headerStyle}
      >
        {winery.lat && winery.lng ? (
          <iframe
            src={`https://maps.google.com/maps?q=${winery.lat},${winery.lng}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen="0"
          ></iframe>
        ) : null}
      </div>
    );
  };

  const WineryRating = ({ winery }) => {
    if (!winery) {
      return;
    }

    return winery?.rate || winery?.ratings ? (
      <div className="average-rate">
        <p>Average Rating</p>
        <p className="rate">
          {winery.rate ? <span>{winery.rate.toFixed(1)} </span> : null}
          {winery.ratings ? <span>{winery.ratings} Ratings</span> : null}
        </p>
      </div>
    ) : null;
  };

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
                `imgs/icons/country/${toKebabCase(data?.country)}.png`
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
