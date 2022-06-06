import React, { useEffect, useState } from "react";
import { WineSlider } from "../../../../Wine/WineView/components/WineSlider/WineSlider";
import { wineService } from "../../../../Wine/service/wine.service";

export function Wines(props) {
  const [wines, setWines] = useState({ loading: { top: true, popular: true } });

  useEffect(() => {
    (async () => {
      loadMoreWines()
    })();
  }, [props.winery]);

  const loadMoreWines = async () => {
    if (!props.winery) {
      return;
    }

    const top = await wineService.getWines({
      filter: { eqWinery: props.winery.name },
      sort: { rate: 0 },
      rule: "AND",
    });

    const popular = await wineService.getWines({
      filter: { eqWinery: props.winery.name },
      sort: { ratings: 0 },
      rule: "AND",
    });

    props.setWinesCount?.(popular.total);
    setWines({ top: top.data, popular: popular.data });
  };

  return (
    <div className="winery-details">
      <>
        <h2>Most popular</h2>
        <p>From {props?.winery?.name}</p>
        <WineSlider wines={wines.popular} loading={!!wines?.loading?.popular} />
      </>

      <>
        <h2>Best rated</h2>
        <p>From {props?.winery?.name}</p>
        <WineSlider wines={wines.top} loading={!!wines?.loading?.top} />
      </>
    </div>
  );
}
