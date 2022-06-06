import { useEffect } from "react";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";

import { WineHeader } from "./components/WineHeader/WineHeader";
import { WineryPreview } from "../../Winery/WineryView/components/WineryPreview/WineryPreview";
import { TasteLike } from "./components/TasteLike/TasteLike";
import { WinePairings } from "./components/WinePairings/WinePairings";
import { WineCommunityReviews } from "./components/WineCommunityReviews/WineCommunityReviews";
import { MoreWines } from "./components/MoreWines/MoreWines";

// const WineHeader = lazy(() =>
//     import(/* webpackChunkName: wine */ './components/WineHeader/WineHeader')
//         .then(module => ({ default: module.WineHeader }))
// );

import "./WineView.scss";
import { WINE_DEMO } from "./constants/wine";
import { Loader } from "../../../components/Loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { MainState } from "../../../store/models/store.models";
import { getWine } from "../store/action";

export const WineView = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { wine, loading } = useSelector((state: MainState) => state.wineModule);

  useEffect(() => {
    if (!props.match.params.id) {
      return;
    }

    dispatch(getWine(props.match.params.id));
  }, [props.match.params.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [wine]);

  return (
    <Loader
      if={loading}
      demo={{ ...WINE_DEMO, ...(location.state?.wine || {}) }}
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
