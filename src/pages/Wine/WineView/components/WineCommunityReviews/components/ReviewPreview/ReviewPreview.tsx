import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Attachments } from "../../../../../../../components/Attachments/Attachments";
import { MediaPreviewModal } from "../../../../../../../components/MediaPreviewModal/MediaPreviewModal";
import { QuickLogin } from "../../../../../../Login/components/QuickLogin/QuickLogin";
import { OnPostReply } from "../OnPostReply/OnPostReply";
import { PostUserInfo } from "../../../../../../UserFeed/components/PostUserInfo/PostUserInfo";
import { PostUserControl } from "../../../../../../UserFeed/components/PostUserControl/PostUserControl";
import { tryRequire } from "../../../../../../../shared/helpers/require";
import { setPostReaction } from "../../../../../../UserFeed/store/action";
import { MainState } from "../../../../../../../store/models/store.models";
import { FullPost, Reply } from "../../../../../../UserFeed/models/post.model";
import React from "react";
import { BaseProps } from "../../../../../../../shared/models/base-props";
import { postService } from "../../../../../../UserFeed/service/post.api-service";
import {
  SET_REPLY,
  UPDATE_REPLIES,
} from "../../../../../../UserFeed/store/types";
import { authService } from "../../../../../../Login/service/auth.service";
import { Id } from "../../../../../../../shared/models/id";

interface Props extends BaseProps {
  review: FullPost;
  activeId: Id;
  setActiveId: (id: Id) => void;
}

export const ReviewPreview = (props: Props): JSX.Element => {
  const dispatch = useDispatch();

  const user = useSelector((state: MainState) => state.authModule.user);
  const [authCb, setAuthCb] = useState<Function | null>(null);
  const [savedReply, setSavedReply] = useState<Reply>({} as Reply);
  const [src, setSrc] = useState<string | null>(null);

  const setLike = async (data: FullPost, type = "review") => {
    if (!user) {
      return;
    }

    dispatch(setPostReaction(data._id, !!data?.ilike));
  };

  const setReply = async (reply: Reply) => {
    const replyRes = await postService[SET_REPLY]({
      ...reply,
      replyId: props.review?._id,
    } as Reply);

    const userInfo = authService.getUserInformation();

    dispatch({ type: UPDATE_REPLIES, reply: { ...replyRes, ...userInfo } });
  };

  const url = props.review.vintage
    ? {
        pathname: `/wine/${props.review.seo}`,
        search: `?year=${props.review.vintage}`,
      }
    : { pathname: `/wine/${props.review.seo}` };

  return (
    <>
      <MediaPreviewModal url={src} onClose={() => setSrc(null)} />

      <div className="wine-review">
        <div
          className="review-card hover-box"
          onClick={() =>
            props.setActiveId(
              props.review._id && props.activeId !== props.review._id && user
                ? props.review._id
                : null
            )
          }
        >
          {props.review.wine ? (
            <Link className="wine-review-title" to={url}>
              <h1>
                {props.review.winery} {props.review.wine} {props.review.vintage}
              </h1>
            </Link>
          ) : null}

          <div className="review-user" style={{ padding: 0 }}>
            <PostUserInfo review={props.review} isMinimal={true} />

            <div className="user-rating flex align-center">
              <div className="review-rate-summery">
                <img
                  src={tryRequire("imgs/icons/single-star.svg")}
                  alt="star"
                />
                <span className="review-rate-title">{props.review.rate}</span>
              </div>

              {!props.review.wine && props.review.vintage ? (
                <Link
                  to={{ search: `?year=${props.review.vintage}` }}
                  className="review-vintage"
                >
                  {props.review.vintage}
                </Link>
              ) : null}
            </div>
          </div>

          <section className="review-content">
            <span className="review-desc">{props.review.description}</span>
            {props.review.attach ? (
              <Attachments
                max={2}
                attachments={props.review.attach || []}
                className={"user-feed-preview"}
                onPreview={setSrc}
              />
            ) : null}
          </section>
        </div>

        <PostUserControl
          post={props.review}
          activeId={props.activeId}
          setActiveId={props.setActiveId}
          setAuthCb={setAuthCb}
        />

        {props.activeId === props.review._id ? (
          <OnPostReply
            post={props.review}
            value={savedReply}
            setReply={setReply}
            setAuthCb={setAuthCb}
            setSrc={setSrc}
          />
        ) : null}
      </div>

      <QuickLogin
        isActive={!!authCb && !user}
        onClose={() => setAuthCb(() => {})}
        onLogin={authCb}
      />
    </>
  );
};
