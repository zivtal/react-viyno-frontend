import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { tryRequire } from "../../../../services/require.service";
import { setPostReaction } from "../../store/action";
import { MainState } from "../../../../store/models/store.models";
import { Post } from "../../models/post.model";

interface Props {
  post: Post;
  activeId: number | null;
  setActiveId: Function;
  setAuthCb?: Function;
}

export const PostUserControl = (props: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.authModule.user);

  const setLike = (data: Post) => {
    if (!user) {
      return;
    }

    dispatch(setPostReaction(data._id, !!data?.ilike));
  };

  return (
    <div className="review-comments">
      <div
        className="community-button"
        onClick={(ev) => {
          ev.stopPropagation();
          user
            ? setLike(props.post)
            : props.setAuthCb?.(() => setLike(props.post));
        }}
      >
        <img
          src={
            props.post.ilike
              ? tryRequire(`imgs/icons/ilike.svg`)
              : tryRequire(`imgs/icons/like.svg`)
          }
          alt="Like"
        />
        <span>{props.post.likes}</span>
      </div>
      <div
        className="community-button"
        onClick={() =>
          props.setActiveId(
            props.activeId === props.post._id ? null : props.post._id
          )
        }
      >
        <img src={tryRequire(`imgs/icons/comment.svg`)} alt="Comment" />
        <span>{props.post.replies}</span>
      </div>
    </div>
  );
};
