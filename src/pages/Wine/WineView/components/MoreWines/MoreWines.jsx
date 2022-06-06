import React, { useEffect, useState } from "react";
import { wineService } from "../../../service/wine.service";
import { WineSlider } from "../WineSlider/WineSlider";
import { Loader } from "../../../../../components/Loader/Loader";

export function MoreWines(props) {
  const [wines, setWines] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let abortController = new AbortController();

    if (!props.wine) {
      return;
    }

    (async () => {
      try {
        const res = await wineService.getWines({
          filter: {
            eqCountry: props.wine.country,
            eqWinery: props.wine.winery,
            neSeo: props.wine.seo,
          },
          page: { size: 8 },
        });
        setWines(res);
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    })();

    return () => abortController.abort();
  }, [props.wine?._id]);

  return (
    <div className="more-wines">
      <Loader if={isLoading} type="overlay-skeleton">
        <h2>{props.title ? props.title : "More wines"}</h2>
      </Loader>
      {props.wine?.winery ? <p>From {props.wine?.winery}</p> : null}
      <WineSlider
        wines={wines?.data}
        loading={isLoading}
        repeat={props.wine?.wineryProducts || 8}
      />
    </div>
  );
}
