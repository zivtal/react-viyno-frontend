import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setWinesFilter } from "../../../store/action";
import { tryRequire } from "../../../../../shared/helpers/require";
import { MainState } from "../../../../../store/models/store.models";
import { Wine } from "../../../models/wine.model";
import { BaseProps } from "../../../../../shared/models/base-props";

interface Props extends BaseProps {
  wine?: Wine;
}

const FoodPairing = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const keywords = useSelector((state: MainState) => state.wineModule.keywords);
  const history = useHistory();

  return (
    <>
      {(props.wine?.pairings || []).map((value: string, index: number) => {
        const name = keywords?.data.foodPairings?.find(
          (val) => val.value === value
        )?.title;
        const goTo = () => {
          dispatch(setWinesFilter({ inPairings: value }));
          history.push(`/wine?pairings=${value}`);
        };

        return (
          <div onClick={goTo} className="meal" key={index}>
            <div className="image-container">
              <img src={tryRequire(`imgs/food/${value}.jpg`)} />
            </div>
            <h3>{name}</h3>
          </div>
        );
      })}
    </>
  );
};

export const WinePairings = (props: Props): JSX.Element => {
  const data = !props.loading ? props.wine : props.demo;

  return (
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
  );
};
