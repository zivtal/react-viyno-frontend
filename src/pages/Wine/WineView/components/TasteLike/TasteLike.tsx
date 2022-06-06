import React from "react";
import { useSelector } from "react-redux";
// @ts-ignore
import { postService } from "../../../../UserFeed/service/post.api-service";
// @ts-ignore
import { ScaleRate } from "./components/ScaleRate/ScaleRate";
// @ts-ignore
import { TasteFill } from "./components/TasteFill/TasteFill";
// @ts-ignore
import { TastePreview } from "../TastePreview/TastePreview";
import { useState } from "react";
import { Wine, WineStructure } from "../../../models/wine.models";
import { MainState } from "../../../../../store/models/store.models";
import { debounce } from "../../../../../services/debounce.service";
import { UPDATE_REVIEW_STRUCTURE } from "../../../../UserFeed/store/types";

interface Props {
  wine?: Wine;
  demo?: Wine | any;
  loading?: boolean;
}

export function TasteLike(props: Props) {
  const user = useSelector<MainState, any>(
    (state: MainState) => state.authModule.user
  );
  const [taste, setTaste] = useState(null);

  const data = !props.loading ? props.wine : props.demo;

  const structureUpdate = (scales: WineStructure) => {
    if (!user || !data?._id) {
      return;
    }

    debounce(
      async () => {
        await postService[UPDATE_REVIEW_STRUCTURE](data._id, scales);
      },
      "POST_WINE_SCALES",
      2000
    );
  };

  return (
    <>
      <section className="taste-like">
        <h2>What does this wine taste like?</h2>
        <ScaleRate wine={data} onSet={structureUpdate} />
        <TasteFill tastes={data?.tastes} onClick={setTaste} />
      </section>

      <TastePreview wine={props.wine} query={taste} onClose={setTaste} />
    </>
  );
}
