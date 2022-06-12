import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddReview } from "./components/AddReview/AddReview";
import { ReviewStat } from "./components/ReviewStat/ReviewStat";
import { StarRate } from "../../../../../components/StarRate/StarRate";
// @ts-ignore
import { ReviewPreview } from "./components/ReviewPreview/ReviewPreview";
import { tryRequire } from "../../../../../services/require.service";
import { getImgSrcFromBase64 } from "../../../../../services/media/media.service";
import { MainState } from "../../../../../store/models/store.models";
import { useLocation } from "react-router-dom";
import { Post } from "../../../../UserFeed/models/post.model";
import { BaseRecords } from "../../../../../shared/models/base-records.model";
import { Wine } from "../../../models/wine.model";
import {
  getHelpfulReviews,
  getMyWineReviews,
  getRecentReviews,
} from "../../../store/action";
import { PaginationControl } from "../../../../../components/PaginationControl/PaginationControl";

interface Reviews {
  [key: string]: {
    state?: BaseRecords<Post>;
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
  reviews?: BaseRecords<Post>;
  activeId: number | null;
  setActiveId: Function;
  onLoadMore?: Function;
}

const WinePreviews = ({
  reviews,
  activeId,
  setActiveId,
  onLoadMore,
}: WinePreviewsProps): JSX.Element | null => {
  const data = reviews?.data;

  if (!data) {
    return null;
  }

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

      {/*<PaginationControl current={0} total={10} onPageSelect={() => null} />*/}
    </>
  ) : (
    <div>No reviews found</div> // TODO: Add no content component
  );
};

const ReviewMenu = ({
  review,
  onSet,
}: {
  review?: string;
  onSet: Function;
}) => {
  const reviews = ["Helpful", "Recent", "You"];

  return (
    <div className="review-menu flex">
      {reviews.map((title, index) => (
        <span
          onClick={() => onSet(reviews[index])}
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

export const WineCommunityReviews = (props: { wine?: Wine }) => {
  const dispatch = useDispatch();
  const location = useLocation();

  const user = useSelector((state: MainState) => state.authModule.user);

  const [activeId, setActiveId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Helpful");
  const [rate, setRate] = useState(null);

  const getQuery = (name: string) => {
    const queryParams = new URLSearchParams(location.search);

    return queryParams.get(name)?.split("-") || [];
  };

  useEffect(() => {
    setRate(null);
    const vintage = +getQuery("year")?.toString();

    if (!props.wine?._id) {
      return;
    }

    if (!props.wine?.myReviews?.data) {
      dispatch(getMyWineReviews(props.wine?._id));
    }

    if (!props.wine?.recentReviews?.data) {
      dispatch(getRecentReviews(props.wine?._id, vintage));
    }

    if (!props.wine?.helpfulReviews?.data) {
      dispatch(getHelpfulReviews(props.wine?._id, vintage));
    }

    return () => {};
  }, [props.wine?._id, user]);

  useEffect(() => {
    const vintage = +getQuery("year")?.toString();

    dispatch(getRecentReviews(props.wine?._id, vintage));
    dispatch(getHelpfulReviews(props.wine?._id, vintage));
  }, [location.search]);

  const reviews: Reviews = {
    Helpful: {
      state: props.wine?.helpfulReviews,
      set: () => {},
      load: () => {},
    },
    Recent: {
      state: props.wine?.recentReviews,
      set: () => {},
      load: () => {},
    },
    You: { state: props.wine?.myReviews, set: () => {} },
  };

  return props.wine ? (
    <>
      <div className="community-reviews">
        <div className="reviews-list">
          <h1>Community reviews</h1>

          <ReviewMenu onSet={setSelectedCategory} review={selectedCategory} />

          <div className="community-reviews__list">
            <WinePreviews
              reviews={reviews[selectedCategory].state}
              activeId={activeId}
              setActiveId={setActiveId}
              onLoadMore={reviews[selectedCategory].load}
            />
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
        reviews={props.wine?.myReviews}
        onSet={setRate}
        onClose={() => setRate(null)}
      />
    </>
  ) : null;
};
