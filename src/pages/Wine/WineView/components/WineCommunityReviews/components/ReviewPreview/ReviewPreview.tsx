import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Attachments } from "../../../../../../../components/Attachments/Attachments";
import { MediaPreviewModal } from "../../../../../../../components/MediaPreviewModal/MediaPreviewModal";
import { QuickLogin } from "../../../../../../Login/components/QuickLogin/QuickLogin";
// @ts-ignore
import { OnPostReply } from "../OnPostReply/OnPostReply";
// @ts-ignore
import { PostUserInfo } from "../../../../../../UserFeed/components/PostUserInfo/PostUserInfo";
import { PostUserControl } from "../../../../../../UserFeed/components/PostUserControl/PostUserControl";
import { tryRequire } from "../../../../../../../services/require.service";
import { setPostReaction } from "../../../../../../UserFeed/store/action";
import { MainState } from "../../../../../../../store/models/store.models";
import { Post } from "../../../../../../UserFeed/models/post.model";
import React from "react";
import { BaseProps } from "../../../../../../../shared/models/base-props";

interface Props extends BaseProps {
  review: Post;
  activeId: number | null;
  setActiveId: Function;
}

export const ReviewPreview = ({
  review,
  activeId,
  setActiveId,
}: Props): JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state: MainState) => state.authModule.user);
  const [authCb, setAuthCb] = useState<Function>(() => {});
  const [savedReply, setSavedReply] = useState(null);
  const [src, setSrc] = useState(null);

  const setLike = async (data: Post, type = "review") => {
    if (!user) {
      return;
    }

    dispatch(setPostReaction(data._id, !!data?.ilike));
  };

  const setReply = async (reply: Post) => {
    // console.log("ReviewPreview", reply);
    // TODO: setReply
  };

  const url = review.vintage
    ? {
        pathname: `/wine/${review.seo}`,
        search: `?year=${review.vintage}`,
      }
    : { pathname: `/wine/${review.seo}` };

  return (
    <>
      <MediaPreviewModal url={src} onClose={() => setSrc(null)} />

      <div className="wine-review">
        <div
          className="review-card hover-box"
          onClick={() =>
            setActiveId(activeId === review._id || !user ? null : review._id)
          }
        >
          {review.wine ? (
            <Link className="wine-review-title" to={url}>
              <h1>
                {review.winery} {review.wine} {review.vintage}
              </h1>
            </Link>
          ) : null}

          <div className="review-user" style={{ padding: 0 }}>
            <PostUserInfo review={review} isMinimal={true} />

            <div className="user-rating flex align-center">
              <div className="review-rate-summery">
                <img
                  src={tryRequire("imgs/icons/single-star.svg")}
                  alt="star"
                />
                <span className="review-rate-title">{review.rate}</span>
              </div>

              {!review.wine && review.vintage ? (
                <Link
                  to={{ search: `?year=${review.vintage}` }}
                  className="review-vintage"
                >
                  {review.vintage}
                </Link>
              ) : null}
            </div>
          </div>

          <section className="review-content">
            <span className="review-desc">{review.description}</span>
            {review.attach ? (
              <Attachments
                max={2}
                attachments={review.attach.split("|").map((url) => ({ url }))}
                className={"user-feed-preview"}
                onPreview={setSrc}
              />
            ) : null}
          </section>
        </div>

        <PostUserControl
          post={review}
          activeId={activeId}
          setActiveId={setActiveId}
          setAuthCb={setAuthCb}
        />

        {activeId === review._id ? (
          <OnPostReply
            review={review}
            value={savedReply}
            setLike={setLike}
            setReply={setReply}
            setAuthCb={setAuthCb}
            setSrc={setSrc}
            // setReplyState={setReplyState}
          />
        ) : null}
      </div>

      <QuickLogin
        isActive={authCb && !user}
        onClose={() => setAuthCb(() => {})}
        onLogin={authCb}
      />
    </>
  );
};
