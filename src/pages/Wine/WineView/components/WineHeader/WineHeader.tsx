import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { StarRateDisplay } from "../../../../../components/StarRateDisplay/StarRateDisplay";
import { Wine, WineKeywords } from "../../../models/wine.model";
import { MainState } from "../../../../../store/models/store.models";
import { toKebabCase } from "../../../../../shared/services/dev.service";
import { getImgSrcFromBase64 } from "../../../../../shared/services/media/media.service";
import { BaseProps } from "../../../../../shared/models/base-props";

interface Props extends BaseProps {
  wine?: Wine;
}

export function WineHeader(props: Props): JSX.Element {
  const history = useHistory();
  const location = useLocation();
  const keywords = useSelector<MainState, WineKeywords | null>(
    (state: MainState) => state.wineModule.keywords
  );
  const [vintage, setVintage] = useState<string | undefined>();

  const getQuery = (name: string) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(name)?.split("-") || [];
  };

  useEffect(() => {
    setVintage(getQuery("year")?.toString());
  }, [location.search]);

  const WineBottle = (): JSX.Element => (
    <svg width="130px" height="380px" viewBox="0 0 340 1280">
      <g transform="translate(-190,1260) scale(0.102,-0.1)" fill="#bbb">
        <path d="M3050 12609 c-217 -12 -268 -22 -304 -59 -29 -29 -31 -35 -34 -123 -3 -71 -8 -97 -22 -112 -14 -16 -19 -47 -24 -171 -7 -144 -6 -153 15 -189 25 -42 25 -23 -6 -1040 -8 -258 -15 -550 -15 -647 0 -212 -16 -457 -36 -553 -26 -131 -59 -180 -250 -376 -267 -274 -398 -468 -492 -729 -81 -226 -100 -332 -112 -630 -30 -748 -40 -6839 -12 -6873 6 -7 24 -55 41 -107 56 -174 86 -203 241 -239 221 -52 544 -71 1235 -71 872 0 1156 35 1299 161 27 23 41 50 65 122 40 123 49 181 60 387 6 100 11 1607 12 3495 3 3467 5 3343 -37 3525 -45 197 -150 428 -284 630 -68 102 -115 157 -253 295 -171 172 -203 213 -238 306 -51 133 -66 281 -79 759 -9 326 -30 1006 -44 1402 -4 121 -3 130 20 173 22 42 24 57 24 184 0 131 -1 139 -25 171 -22 30 -25 44 -25 116 0 49 -6 96 -15 117 -14 33 -19 36 -87 52 -137 31 -348 39 -618 24z" />
      </g>
    </svg>
  );

  const WineTags = (): JSX.Element => {
    const map = [
      {
        title: data?.country,
        path: `/wine?country=${data?.country?.toLowerCase()}`,
      },
      {
        title: data?.region,
        path: `/wine?region=${data?.region?.toLowerCase()}`,
      },
      ...(data?.grapes || []).map((value: string) => {
        const name = keywords?.data?.grapes?.find(
          (grape) => grape.value === value
        )?.title;

        return {
          title: name,
          path: `/wine?grapes=${value}`,
        };
      }),
    ];
    return (
      <div className="tags">
        {map
          .filter(({ title }) => title)
          .map((keyword, idx) => {
            return (
              <span
                onClick={() => history.push(keyword.path)}
                className="tag"
                key={idx}
              >
                {keyword.title}
              </span>
            );
          })}
      </div>
    );
  };

  const data = !props.loading ? props.wine : props.demo;

  return (
    <section className="wine-header full">
      <div className="information fit-media">
        <div className="picture">
          {data?.imageData ? (
            <img
              src={getImgSrcFromBase64(data?.imageData, data?.imageType)}
              alt={data?.name}
            />
          ) : (
            <WineBottle />
          )}
        </div>

        <div className="wine-content">
          <Link
            to={
              data?.winery
                ? {
                    pathname: `/winery/${toKebabCase(data?.winery)}`,
                    state: { seo: toKebabCase(data?.winery) },
                  }
                : {}
            }
          >
            <h2>{data?.winery}</h2>
          </Link>

          <h1>
            {data?.name} {vintage}
          </h1>

          <WineTags />

          <StarRateDisplay rate={data?.rate} ratings={data?.ratings} />
        </div>
      </div>
    </section>
  );
}
