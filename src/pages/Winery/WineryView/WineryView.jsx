import React, { useEffect, useState } from "react";
import { WineryHeader } from "./components/WineryHeader/WineryHeader";
import { Wines } from "./components/Wines/Wines";
import { getCurrentPosition } from "../../../services/util.service";
import "./WineryView.scss";
import { useDispatch, useSelector } from "react-redux";
import { getWinery } from "../store/action";
import { MainState } from "../../../store/models/store.models";
import { WINERY } from "../store/types";

export const WineryView = (props) => {
  const dispatch = useDispatch();
  const [winesCount, setWinesCount] = useState(null);
  const winery = useSelector((state: MainState) => state.wineryModule[WINERY]);

  useEffect(() => {
    const { id } = props.match.params;
    (async () => {
      try {
        const location = await getCurrentPosition();
        dispatch(getWinery(id, { ...location }));
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
