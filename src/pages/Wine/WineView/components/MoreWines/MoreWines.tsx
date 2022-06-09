import React, { useEffect, useState } from "react";
import { wineService } from "../../../service/wine.service";
import { WineSlider } from "../WineSlider/WineSlider";
import { Loader } from "../../../../../components/Loader/Loader";
import { BaseProps } from "../../../../../shared/models/base-props";
import { Wine } from "../../../models/wine.model";
import { GET_WINES } from "../../../store/types";

interface Props extends BaseProps {
  title?: string;
  wine?: Wine;
}

export function MoreWines(props: Props): JSX.Element {
  const [wines, setWines] = useState<Array<Wine>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let abortController = new AbortController();

    if (!props.wine) {
      return;
    }

    (async () => {
      try {
        const res = await wineService[GET_WINES]({
          filter: {
            eqCountry: props.wine?.country,
            eqWinery: props.wine?.winery,
            neSeo: props.wine?.seo,
          },
          page: { index: 0, size: 8 },
        });
        setWines(res?.data || []);
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
        {props.wine?.winery ? <p>From {props.wine?.winery}</p> : null}
      </Loader>
      <WineSlider
        wines={wines}
        loading={isLoading}
        repeat={props.wine?.wineryProducts || 8}
      />
    </div>
  );
}
