import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setWinesFilter } from "../../../store/action";
import { tryRequire } from "../../../../../services/require.service";
import { Loader } from "../../../../../components/Loader/Loader";

export const WinePairings = (props) => {
  const dispatch = useDispatch();
  const keywords = useSelector((state) => state.wineModule.keywords);
  const history = useHistory();

  const FoodPairing = (props) =>
    (props.wine?.pairings || []).map((seo, idx) => {
      const name = keywords?.data["food pairings"]?.find(
        (val) => val.seo === seo
      )?.name;
      const goTo = () => {
        dispatch(setWinesFilter({ inPairings: seo }));
        history.push(`/wine?pairings=${seo}`);
      };

      return (
        <div onClick={goTo} className="meal" key={"FOOD_PAIR_" + idx}>
          <div className="image-container">
            <img src={tryRequire(`imgs/food/${seo}.jpg`)} />
          </div>
          <h3>{name}</h3>
        </div>
      );
    });

  const data = !props.loading ? props.wine : props.demo;

  return (
    // <Loader if={props.loading} type="overlay-skeleton">
    <section className="wine-pairings">
      <div className="information">
        <div className="content">
          <h2>Food that goes well with this wine</h2>
          <p>
            Our team of wine experts thinks this
            <span> {data?.style || data?.name} </span>
            would be a perfect match with these dishes.
          </p>
        </div>
        {/* <img
          src={getImgSrcFromBase64(data.imageData, data.imageType)}
          onError={({ target }) => (target.style.visibility = "hidden")}
        /> */}
      </div>
      <div className="meals">
        <FoodPairing wine={data} />
      </div>
    </section>
    // </Loader>
  );
};
