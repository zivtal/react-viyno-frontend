import React, { useEffect, useState } from "react";
import { WineryHeader } from "./components/WineryHeader/WineryHeader";
import { Wines } from "./components/Wines/Wines";
import { getCurrentPosition } from "../../../services/util.service";
import { wineService } from "../../Wine/service/wine.service";
import { wineryService } from "../service/winery.service";
import "./WineryView.scss";

export const WineryView = (props) => {
  const [winery, setWinery] = useState(null);
  const [winesCount, setWinesCount] = useState(null);

  useEffect(() => {
    const { id } = props.match.params;
    (async () => {
      try {
        const location = await getCurrentPosition();
        const winery = await wineryService.getById(id, {
          ...location,
        });
        setWinery(winery?.err ? { name: id } : winery);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [props.match?.params?.id]);

  return winery ? (
    <>
      <WineryHeader winery={winery} winesCount={winesCount} />
      <Wines winery={winery} setWinesCount={setWinesCount} />
    </>
  ) : null;
};
