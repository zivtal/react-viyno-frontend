import React from "react";
import { useSelector } from "react-redux";
import { postService } from "../../../../UserFeed/service/post.api-service";
import { ScaleRate } from "./components/ScaleRate/ScaleRate";
// @ts-ignore
import { TasteFill } from "./components/TasteFill/TasteFill";
import { TastePreview } from "../TastePreview/TastePreview";
import { useState } from "react";
import { Wine, WineQuery, WineStructure } from "../../../models/wine.model";
import { MainState } from "../../../../../store/models/store.models";
import { UPDATE_REVIEW_STRUCTURE } from "../../../../UserFeed/store/types";
import { BaseProps } from "../../../../../shared/models/base-props";
import DebounceService from "../../../../../shared/services/debounce.service";

interface Props extends BaseProps {
  wine?: Wine;
}

export function TasteLike(props: Props): JSX.Element {
  const user = useSelector<MainState, any>(
    (state: MainState) => state.authModule.user
  );
  const [taste, setTaste] = useState(null);

  const data = !props.loading ? props.wine : props.demo;

  const structureUpdate = (scales: WineStructure) => {
    if (!user || !data?._id) {
      return;
    }

    DebounceService.set(
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

      <TastePreview
        wine={props.wine || ({} as Wine)}
        query={taste || ({} as WineQuery)}
        onClose={setTaste}
      />
    </>
  );
}
