import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReplyToReply } from "../ReplyToReply/ReplyToReply";
import { PostEditor } from "../../../../../../UserFeed/components/PostEditor/PostEditor";
import { tryRequire } from "../../../../../../../services/require.service";
import { Loader } from "../../../../../../../components/Loader/Loader";
import { getReplies } from "../../../../../../UserFeed/store/action";
import { MainState } from "../../../../../../../store/models/store.models";

export const OnPostReply = ({ review, value, setReply, setAuthCb, setSrc }) => {
  const dispatch = useDispatch();

  const user = useSelector((state: MainState) => state.authModule.user);
  const [isLoading, setLoading] = useState(null);
  const page = review?.reply?.page;

  return (
    <>
      {!isLoading && page && page?.index < page?.total - 1 ? (
        <div
          className="load-more"
          onClick={() => dispatch(getReplies(review._id))}
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
        review={review}
        set={setReply}
        ids={[review._id]}
        setAuthCb={setAuthCb}
        setSrc={setSrc}
        onLoadMore={() => console.log}
      />

      {user ? (
        <PostEditor
          value={value}
          data={{ replyId: review?._id }}
          onSubmit={setReply}
        />
      ) : null}
    </>
  );
};
