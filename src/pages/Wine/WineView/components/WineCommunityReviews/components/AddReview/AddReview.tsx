import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postServiceOld } from "../../../../../../UserFeed/service/post.api-service";
// @ts-ignore
import { getCurrentPosition } from "../../../../../../../services/util.service";
import { Attachments } from "../../../../../../../components/Attachments/Attachments";
import { StarRate } from "../../../../../../../components/StarRate/StarRate";
import { QuickLogin } from "../../../../../../Login/components/QuickLogin/QuickLogin";
import { tryRequire } from "../../../../../../../services/require.service";
import { cloudUpload } from "../../../../../../../services/media/media.service";
import { OverlayModal } from "../../../../../../../components/OverlayModal/OverlayModal";
import { Wine } from "../../../../../models/wine.model";
import { BaseRecords } from "../../../../../../../shared/models/base-records.model";
import { Post } from "../../../../../../UserFeed/models/post.model";
import { MainState } from "../../../../../../../store/models/store.models";
import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import { SET_WINE } from "../../../../../store/types";
import { BaseProps } from "../../../../../../../shared/models/base-props";

interface Props extends BaseProps {
  wine: Wine;
  rateValue: number | null;
  onSet: Function;
  onClose: Function;
  reviews: BaseRecords<Post>;
}

export const AddReview = (props: Props): JSX.Element | null => {
  const history = useHistory();
  const location = useLocation();
  const queries = new URLSearchParams(location.search);

  const setQuery = (name: string, value: string) => {
    if (value) queries.set(name, value);
    else queries.delete(name);
    history.replace({ search: queries.toString() });
  };

  const getQuery = (name: string) => {
    return queries.get(name)?.split("-") || [];
  };

  const [id, setId] = useState<number | null>(null);
  const [rate, setRate] = useState<number>(props.rateValue || 0);
  const [vintage, setVintage] = useState<number>(
    +getQuery("year")?.toString() || new Date().getFullYear()
  );
  const [description, setDescription] = useState<string>("");
  const [attach, setAttach] = useState<Array<string>>([]);
  const [isLoginActive, setIsLoginActive] = useState<boolean>(false);
  const user = useSelector((state: MainState) => state.authModule.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      setIsLoginActive(true);
    }
  }, [props.rateValue, user]);

  useEffect(() => {
    if (!props.reviews) return;
    if (!vintage) {
      setDescription("");
      setId(null);
    } else {
      const review = (props.reviews.data || []).find(
        (review: Post) => review.vintage === vintage
      );

      if (review) {
        setDescription(review.description);
        setRate(review.rate || 0);
        setId(review._id);
      }
    }
  }, [vintage]);

  if (!props.rateValue) {
    return null;
  }

  if (props.rateValue !== rate) {
    setRate(props.rateValue);
  }

  const upload = async (ev: any, type: string): Promise<void> => {
    const res = await cloudUpload(ev.target?.files || [], type);

    setAttach([...attach, ...res]);
  };

  const submit = async (): Promise<void> => {
    if (!description || !vintage) {
      return;
    }

    try {
      const location = (await getCurrentPosition()) || {};

      const body = {
        attach: attach.join("|"),
        vintage,
        rate,
        description,
        ...location,
      };

      const recent = await postServiceOld.review(
        props.wine._id || props.wine.seo,
        id ? { _id: id, ...body } : body,
        { type: "review" }
      );

      const prevRate =
        (props.reviews.data || []).find(
          (review: Post) => review.vintage === vintage
        )?.rate || 0;

      const wineRate = props.wine.rate || 0;
      const wineRatings = props.wine.ratings || 0;

      dispatch({
        type: SET_WINE,
        wine: {
          ...props.wine,
          rate: id
            ? (wineRate * wineRatings - prevRate + wineRate) / wineRatings
            : (wineRate * wineRatings + wineRate) / (wineRatings + 1),
          ratings: id ? wineRatings : wineRatings + 1,
        },
      });

      setQuery("year", vintage.toString());
      props.onClose(recent);
    } catch (err) {
      console.error(err);
    }
  };

  const handleKeyDown = (ev: any): void => {
    if (ev.keyCode === 27) {
      props.onClose();
    }
  };

  const validateAndPost = async (): Promise<void> => {
    if (!description) {
      props.onClose(null);
      return;
    }

    await submit();
  };

  return user ? (
    <OverlayModal if={!!user}>
      <section
        slot="content"
        className="wine-add-review"
        onClick={(ev) => ev.stopPropagation()}
      >
        <div className="close-btn" onClick={() => props.onClose(null)}>
          X
        </div>

        <form>
          <label>
            <span>Rate:</span>

            <StarRate
              rate={rate}
              editable={true}
              size={24}
              onSet={props.onSet}
            />
          </label>

          <label>
            <span>Vintage:</span>

            <input
              autoFocus
              className="vintage"
              type="number"
              min={1900}
              max={new Date().getFullYear()}
              value={vintage}
              onChange={(val) => setVintage(+val.target.value)}
            ></input>
          </label>

          <label>
            <span>Description:</span>

            <textarea
              value={description}
              onChange={(val) => setDescription(val.target.value)}
              maxLength={512}
            ></textarea>

            <p className="chars-left">{512 - description?.length}</p>

            <label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(ev) => upload(ev, "image")}
                hidden
              />

              <img src={tryRequire("imgs/icons/add-image.svg")} />
            </label>

            {/* <p className="warning">* Description cannot be blank</p> */}
          </label>
        </form>

        <Attachments
          attachments={attach.map((url) => ({ url }))}
          onSet={setAttach}
        />

        <button className="submit" onClick={validateAndPost}>
          Submit
        </button>
      </section>
    </OverlayModal>
  ) : (
    <QuickLogin
      isActive={isLoginActive && !user}
      onClose={() => setIsLoginActive(false)}
    />
  );
};
