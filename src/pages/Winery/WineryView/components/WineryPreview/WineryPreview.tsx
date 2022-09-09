import React from "react";
import { useHistory } from "react-router-dom";
import { tryRequire } from "../../../../../shared/helpers/require";
import { toKebabCase } from "../../../../../shared/services/dev.service";
import { getImgSrcFromBase64 } from "../../../../../shared/services/media/media.service";
import { Wine } from "../../../../Wine/models/wine.model";
import { BaseProps } from "../../../../../shared/models/base-props";

interface Props extends BaseProps {
  wine?: Wine;
}

export function WineryPreview(props: Props): JSX.Element | null {
  const history = useHistory();

  const data = !props.loading ? props.wine : props.demo;

  return data?.wineryOverview ? (
    <section className="winery-preview hover-box">
      <section className="information">
        <h2>{data.winery}</h2>

        <div className="country">
          <img
            src={tryRequire(
              `imgs/icons/country/${toKebabCase(data.country)}.png`,
              `imgs/icons/country/other.png`
            )}
            alt={data.country}
          />

          <p>{data.country}</p>
        </div>

        <p className="short-description">{data.wineryOverview}</p>

        <div className="winery-information">
          <button
            className="more"
            onClick={() => history.push(`/winery/${toKebabCase(data.winery)}`)}
            disabled={props.loading}
          >
            Read more
          </button>

          <div className="winery-status">
            {data.wineryRate ? (
              <div className="average-rate">
                <p>Average Rating</p>
                <p className="rate">
                  <span>{data.wineryRate} </span>
                  <span>({data.wineryRatings} Ratings)</span>
                </p>
              </div>
            ) : null}

            {data.wineryProducts ? (
              <div className="wines-count">
                <p>Wines</p>
                <p>{data.wineryProducts}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <section className="image">
        <img src={data.background} />
        {data.wineryLogo ? (
          <img
            className="logo"
            src={getImgSrcFromBase64(data.wineryLogo)}
            alt={data.winery}
          />
        ) : null}
      </section>
    </section>
  ) : null;
}
