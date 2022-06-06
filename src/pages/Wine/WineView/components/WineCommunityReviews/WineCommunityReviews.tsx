import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddReview } from "./components/AddReview/AddReview";
import { ReviewStat } from "./components/ReviewStat/ReviewStat";
import { StarRate } from "../../../../../components/StarRate/StarRate";
// @ts-ignore
import { ReviewPreview } from "./components/ReviewPreview/ReviewPreview";
import { tryRequire } from "../../../../../services/require.service";
import { Loader } from "../../../../../components/Loader/Loader";
import { getImgSrcFromBase64 } from "../../../../../services/media/media.service";
import {
  HELPFUL_REVIEWS,
  MY_REVIEWS,
  RECENT_REVIEWS,
} from "../../../../UserFeed/store/types";
import {
  getHelpfulReviews,
  getMyReviews,
  getRecentReviews,
} from "../../../../UserFeed/store/action";
import { MainState } from "../../../../../store/models/store.models";
import { useLocation } from "react-router-dom";
import { REVIEW_DEMO } from "../../constants/wine";
import { Post } from "../../../../UserFeed/models/post.model";
import { BaseRecords } from "../../../../../shared/models/base-records.model";
import { Wine } from "../../../models/wine.model";

interface Reviews {
  [key: string]: {
    state: BaseRecords<Post>;
    set: Function;
    load?: Function;
  };
}

interface UserRateProps {
  user: any;
  rate: number | null;
  set: Function;
}

const UserRate = ({ user, rate, set }: UserRateProps) => {
  return (
    <>
      <p className="rating-feedback">
        Add your own rating and help other users pick the right wine!
      </p>
      <div className="user-rating-selection flex align-center ">
        <img
          className="user-profile"
          src={
            getImgSrcFromBase64(user?.imageData, user?.imageType) ||
            tryRequire("imgs/icons/user-profile.svg")
          }
          alt="user-profile"
        />
        <StarRate size={30} rate={rate} editable={true} onSet={set} />
      </div>
      <span className="saperate"></span>
    </>
  );
};

export const setLikeState = () => {};

export const setReviewState = () => {};

export const setReplyState = () => {};

interface WinePreviewsProps {
  demo?: any;
  loading?: boolean;
  reviews: BaseRecords<Post>;
  activeId: number | null;
  setActiveId: Function;
  onLoadMore?: Function;
}

const WinePreviews = ({
  demo,
  loading,
  reviews,
  activeId,
  setActiveId,
  onLoadMore,
}: WinePreviewsProps) => {
  const data =
    loading && !reviews?.data?.length ? Array(3).fill(demo) : reviews?.data;

  const isMore = (): boolean => {
    const page = reviews?.page;

    if (!page?.index || !page?.total) {
      return false;
    }

    return page?.index < page.total - 1;
  };

  return data?.length ? (
    <>
      {data.map((review, index) => (
        <ReviewPreview
          review={review}
          activeId={activeId}
          setActiveId={setActiveId}
          key={index}
        />
      ))}

      {isMore() ? (
        <div className="load-more" onClick={() => onLoadMore?.()}>
          <div className="community-button hover-box">
            <img
              src={tryRequire(`imgs/icons/load-more.svg`)}
              alt="load more reviews"
            />
            <span>Load more reviews</span>
          </div>
        </div>
      ) : null}
    </>
  ) : (
    <div>No reviews found</div> // TODO: Add no content component
  );
};

export const WineCommunityReviews = (props: { wine?: Wine }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state: MainState) => state.authModule.user);

  const {
    loading,
    [HELPFUL_REVIEWS]: helpfulReviews,
    [MY_REVIEWS]: userReviews,
    [RECENT_REVIEWS]: recentReviews,
  } = useSelector((state: MainState) => state.postModule);

  const [activeId, setActiveId] = useState(null);
  const [review, setReviewSection] = useState("Helpful");
  const [rate, setRate] = useState(null);

  const getQuery = (name: string) => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get(name)?.split("-") || [];
  };

  useEffect(() => {
    setRate(null);
    const vintage = +getQuery("year")?.toString();

    dispatch(getMyReviews(props.wine?._id));
    dispatch(getRecentReviews(props.wine?._id, vintage, true));
    dispatch(getHelpfulReviews(props.wine?._id, vintage, true));
  }, [props.wine, location.search, user]);

  const ReviewMenu = () => {
    const reviews = ["Helpful", "Recent", "You"];

    return (
      <div className="review-menu flex">
        {reviews.map((title, index) => (
          <span
            onClick={() => setReviewSection(reviews[index])}
            style={{
              color:
                review === reviews[index]
                  ? "var(--base-color1)"
                  : "var(--base-text)",
            }}
            key={`COMMENT_${index}`}
          >
            {title}
          </span>
        ))}
      </div>
    );
  };

  const reviews: Reviews = {
    Helpful: {
      state: helpfulReviews,
      set: () => {},
      load: () => {},
    },
    Recent: {
      state: recentReviews,
      set: () => {},
      load: () => {},
    },
    You: { state: userReviews, set: () => {} },
  };

  return props.wine ? (
    <>
      <div className="community-reviews">
        <div className="reviews-list">
          <h1>Community reviews</h1>

          <ReviewMenu />

          <div className="community-reviews__list">
            <Loader type="overlay-skeleton" if={loading} demo={REVIEW_DEMO}>
              <WinePreviews
                reviews={reviews[review].state}
                activeId={activeId}
                setActiveId={setActiveId}
                onLoadMore={reviews[review].load}
              />
            </Loader>
          </div>
        </div>

        <div className="review-statistics">
          <ReviewStat wine={props.wine} />

          <UserRate user={user} rate={rate} set={setRate} />
        </div>
      </div>

      <AddReview
        rateValue={rate}
        wine={props.wine}
        reviews={userReviews}
        onSet={setRate}
        onClose={() => setRate(null)}
      />
    </>
  ) : null;
};
