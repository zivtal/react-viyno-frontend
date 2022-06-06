import React, { useEffect, useState } from "react";
import { WineSlider } from "../../../../Wine/WineView/components/WineSlider/WineSlider";
import { wineService } from "../../../../Wine/service/wine.service";
import { BaseProps } from "../../../../../shared/models/base-props";
import { Winery } from "../../../models/winery.model";
import { Wine } from "../../../../Wine/models/wine.model";
import { GET_WINES } from "../../../../Wine/store/types";

interface Props extends BaseProps {
  winery: Winery | undefined;
  setWinesCount: Function;
}

interface LocalWineState {
  loading?: {
    top?: boolean;
    popular?: boolean;
  };
  top?: Array<Wine>;
  popular?: Array<Wine>;
}

export function Wines(props: Props): JSX.Element {
  const [wines, setWines] = useState<LocalWineState>({
    loading: { top: true, popular: true },
  });

  useEffect(() => {
    (async () => {
      loadMoreWines();
    })();
  }, [props.winery]);

  const loadMoreWines = async () => {
    if (!props.winery) {
      return;
    }

    const top = await wineService[GET_WINES]({
      filter: { eqWinery: props.winery.name },
      sort: { rate: 0 },
    });

    const popular = await wineService[GET_WINES]({
      filter: { eqWinery: props.winery.name },
      sort: { ratings: 0 },
    });

    props.setWinesCount?.(popular.total);
    setWines({ top: top.data, popular: popular.data });
  };

  return (
    <div className="winery-details">
      <>
        <h2>Most popular</h2>
        <p>From {props.winery?.name}</p>
        <WineSlider
          wines={wines.popular}
          loading={!!wines?.loading?.popular}
          repeat={props.winery?.wines || 8}
        />
      </>

      <>
        <h2>Best rated</h2>
        <p>From {props.winery?.name}</p>
        <WineSlider
          wines={wines.top}
          loading={!!wines?.loading?.top}
          repeat={props.winery?.wines || 8}
        />
      </>
    </div>
  );
}
