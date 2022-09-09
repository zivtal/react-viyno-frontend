import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// @ts-ignore
import { ReplyToReply } from "../ReplyToReply/ReplyToReply";
import { PostEditor } from "../../../../../../UserFeed/components/PostEditor/PostEditor";
import { tryRequire } from "../../../../../../../shared/helpers/require";
import { Loader } from "../../../../../../../components/Loader/Loader";
import { getReplies } from "../../../../../../UserFeed/store/action";
import { MainState } from "../../../../../../../store/models/store.models";
import { FullPost, Post } from "../../../../../../UserFeed/models/post.model";

interface Props {
  post?: FullPost;
  value?: Post;
  setReply: Function;
  setAuthCb: Function;
  setSrc: Function;
  setReplyState?: Function;
}

export const OnPostReply = (props: Props) => {
  const dispatch = useDispatch();

  const user = useSelector((state: MainState) => state.authModule.user);
  const [isLoading, setLoading] = useState(false);
  const page = props.post?.reply?.page;

  return (
    <>
      {!isLoading && page && (page?.index || 0) < (page?.total || 0) - 1 ? (
        <div
          className="load-more"
          onClick={() => dispatch(getReplies(props.post?._id))}
        >
          <div className="community-button">
            <img
              src={tryRequire(`imgs/icons/load-more.svg`)}
              alt="load more comments"
            />
            <span>Load more comments</span>
          </div>
        </div>
      ) : null}

      <Loader if={isLoading} type="float-1" size={36} />

      <ReplyToReply
        review={props.post}
        set={props.setReply}
        ids={[props.post?._id]}
        setAuthCb={props.setAuthCb}
        setSrc={props.setSrc}
        onLoadMore={() => console.log}
      />

      {user ? (
        <PostEditor
          value={props.value}
          autoFocus={true}
          onSubmit={props.setReply}
        />
      ) : null}
    </>
  );
};
