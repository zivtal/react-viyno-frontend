import React from "react";
import { Link } from "react-router-dom";
import { StarRate } from "../../../../../components/StarRate/StarRate";
// @ts-ignore
import { ScaleRate } from "../TasteLike/components/ScaleRate/ScaleRate";
import { tryRequire } from "../../../../../services/require.service";
import { toKebabCase } from "../../../../../services/dev.service";
import { getImgSrcFromBase64 } from "../../../../../services/media/media.service";
import { Wine } from "../../../models/wine.models";
import "./WineCardPreview.scss";

interface WinePreviewProps extends React.HTMLAttributes<HTMLDivElement> {
  wine: Wine;
  isMinimal?: boolean;
}

const WineRate = ({ wine }: { wine: Wine }) => {
  return wine.rate ? (
    <div className="wine-rate">
      <p className="avg-rate">{wine.rate.toFixed(1)}</p>
      <StarRate rate={+wine.rate.toFixed(1)} />
      {wine.ratings ? (
        <p className="total-ratings">{wine.ratings} ratings</p>
      ) : null}
    </div>
  ) : null;
};

const WineImage = ({ wine }: { wine: Wine }) => {
  return wine.imageData ? (
    <img
      className="bottle-img"
      src={
        getImgSrcFromBase64(wine.imageData, wine?.imageType) ||
        tryRequire("imgs/bottle.png")
      }
    />
  ) : (
    <svg width="100px" height="390px" viewBox="0 0 320 1280">
      <g
        transform="translate(-200,1264) scale(0.1,-0.1)"
        fill="#111"
        stroke="none"
      >
        <path d="M3050 12609 c-217 -12 -268 -22 -304 -59 -29 -29 -31 -35 -34 -123 -3 -71 -8 -97 -22 -112 -14 -16 -19 -47 -24 -171 -7 -144 -6 -153 15 -189 25 -42 25 -23 -6 -1040 -8 -258 -15 -550 -15 -647 0 -212 -16 -457 -36 -553 -26 -131 -59 -180 -250 -376 -267 -274 -398 -468 -492 -729 -81 -226 -100 -332 -112 -630 -30 -748 -40 -6839 -12 -6873 6 -7 24 -55 41 -107 56 -174 86 -203 241 -239 221 -52 544 -71 1235 -71 872 0 1156 35 1299 161 27 23 41 50 65 122 40 123 49 181 60 387 6 100 11 1607 12 3495 3 3467 5 3343 -37 3525 -45 197 -150 428 -284 630 -68 102 -115 157 -253 295 -171 172 -203 213 -238 306 -51 133 -66 281 -79 759 -9 326 -30 1006 -44 1402 -4 121 -3 130 20 173 22 42 24 57 24 184 0 131 -1 139 -25 171 -22 30 -25 44 -25 116 0 49 -6 96 -15 117 -14 33 -19 36 -87 52 -137 31 -348 39 -618 24z" />
      </g>
    </svg>
  );
};

const WineBackground = ({ wine }: { wine: Wine }) => {
  const rtl = document.dir === "rtl";

  return wine.background ? (
    <img
      src={wine.background}
      className={rtl ? "card-wave-rtl" : "card-wave"}
      onError={(ev: any) => (ev.target.style.visibility = "hidden")}
    />
  ) : null;
};

export const WineCardPreview = ({
  wine,
  style,
  isMinimal,
}: WinePreviewProps) => {
  const rtl = document.dir === "rtl";

  return (
    <Link
      className={`wine-card-preview hover-box bgi`}
      style={rtl ? { flexDirection: "row-reverse", ...style } : style}
      to={{ pathname: `/wine/${wine.seo}`, state: { wine } }}
    >
      <WineBackground wine={wine} />

      <div className="preview-header">
        <div className="wine-bottle">
          <WineImage wine={wine} />
        </div>

        <WineRate wine={wine} />

        {!isMinimal ? <ScaleRate wine={wine} isMinimal /> : null}
      </div>

      <div className="preview-info">
        <h5>{wine.winery}</h5>

        <h4>{wine.name}</h4>

        <div className="wine-country">
          <img
            src={tryRequire(
              `imgs/icons/country/${toKebabCase(wine.country)}.png`,
              `other country`
            )}
          />

          <span>
            {wine.region ? wine.region + ", " : ""}
            {wine.country}
          </span>
        </div>
      </div>
    </Link>
  );
};
