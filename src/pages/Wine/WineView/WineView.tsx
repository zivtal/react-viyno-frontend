import React, {lazy} from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { WineHeader } from "./components/WineHeader/WineHeader";
import { WineryPreview } from "../../Winery/WineryView/components/WineryPreview/WineryPreview";
import { TasteLike } from "./components/TasteLike/TasteLike";
import { WinePairings } from "./components/WinePairings/WinePairings";
import { WineCommunityReviews } from "./components/WineCommunityReviews/WineCommunityReviews";
import { MoreWines } from "./components/MoreWines/MoreWines";
import { Loader } from "../../../components/Loader/Loader";
import { MainState } from "../../../store/models/store.models";
import { getWine } from "../store/action";
import { WINE_DEMO } from "./constants/wine";
import { WINES_CACHE } from "../store/types";
import "./WineView.scss";

export const WineView = (props: any): JSX.Element => {
  const state = useLocation<Location>().state as any;
  const dispatch = useDispatch();

  const { [WINES_CACHE]: wines, loading } = useSelector(
    (state: MainState) => state.wineModule
  );

  const wine = wines.find((wine) => wine.seo === props.match.params.id);

  useEffect(() => {
    if (!props.match.params.id || wine?.seo === props.match.params.id) {
      return;
    }

    window.scrollTo(0, 0);
    dispatch(getWine(props.match.params.id));
  }, [props.match.params.id]);

  useEffect(() => {}, [props.match.params.id]);

  return (
    <Loader
      if={loading}
      demo={{ ...WINE_DEMO, ...(state?.wine || {}) }}
      type="overlay-skeleton"
    >
      <WineHeader wine={wine} />
      <WineryPreview wine={wine} />
      <TasteLike wine={wine} />
      <WinePairings wine={wine} />
      <WineCommunityReviews wine={wine} />
      <MoreWines wine={wine} />
    </Loader>
  );
};
