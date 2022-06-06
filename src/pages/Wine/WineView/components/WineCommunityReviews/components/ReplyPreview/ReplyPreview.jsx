import moment from "moment";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Attachments } from "../../../../../../../components/Attachments/Attachments";
import { ReplyToReply } from "../ReplyToReply/ReplyToReply";
import { PostEditor } from "../../../../../../UserFeed/components/PostEditor/PostEditor";
import { tryRequire } from "../../../../../../../services/require.service";
import "./ReplyPreview.scss";
import { setPostReaction } from "../../../../../../UserFeed/store/action";
import { getImgSrcFromBase64 } from "../../../../../../../services/media/media.service";

export const ReplyPreview = ({
  reply,
  ids,
  set,
  onLoadMore,
  setAuthCb,
  setSrc,
}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authModule.user);

  const setLike = (data, type = "reply") => {
    if (!user) {
      return;
    }

    dispatch(setPostReaction(data._id, !!data?.ilike));
  };

  const [replyToReply, setReplyToReply] = useState(null);
  return (
    <>
      <div className={`reply-preview ${reply.replyId ? "reply-to-reply" : ""}`}>
        <img
          src={getImgSrcFromBase64(reply.photoData, reply.photoType)}
          onError={(ev) =>
            (ev.target.src = tryRequire("imgs/icons/user-profile.svg"))
          }
        />

        <div className="reply-content">
          <div>
            <div className="reply-user-info">
              <span>{reply.userName} </span>
              {!reply.replyId ? (
                <button className="follow-button">Follow</button>
              ) : null}
            </div>

            <p>{reply.description}</p>

            <Attachments
              id={reply._id}
              level={ids?.length}
              attachments={reply?.attach}
              onPreview={setSrc}
            />
          </div>

          <div className="control-panel">
            <div>
              <span
                onClick={(ev) => {
                  ev.stopPropagation();
                  user
                    ? setLike(reply, "reply")
                    : setAuthCb(() => setLike(reply, "reply"));
                }}
              >
                {reply.ilike ? "Unlike" : "Like"}
              </span>

              <span
                onClick={() =>
                  user
                    ? setReplyToReply(
                        replyToReply === reply._id ? null : reply._id
                      )
                    : setAuthCb(() =>
                        setReplyToReply(
                          replyToReply === reply._id ? null : reply._id
                        )
                      )
                }
              >
                Reply
              </span>

              <span>{moment(reply.createdAt).fromNow()}</span>
            </div>

            <div>
              {reply.replies - reply.reply?.data?.length > 0 ? (
                <div
                  className="community-button"
                  onClick={() => onLoadMore?.(ids[ids.length - 1], reply._id)}
                >
                  <img src={tryRequire(`imgs/icons/load-more.svg`)} />

                  <span>{reply.replies - reply.reply?.data?.length}</span>
                </div>
              ) : null}
              {/* <div className="community-button" onClick={() => {}}>
                  <img src={tryRequire(`imgs/icons/comment.svg`)} />
                  <span>{reply.replies}</span>
                </div> */}
              {reply.likes ? (
                <div
                  className="community-button"
                  onClick={(ev) => {
                    ev.stopPropagation();
                    user
                      ? setLike(reply, "reply")
                      : setAuthCb(() => setLike(reply, "reply"));
                  }}
                >
                  <img
                    src={
                      reply.ilike
                        ? tryRequire(`imgs/icons/ilike.svg`)
                        : tryRequire(`imgs/icons/like.svg`)
                    }
                  />

                  <span>{reply.likes}</span>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <ReplyToReply
          ids={[...ids, reply._id]}
          review={reply}
          set={set}
          setAuthCb={setAuthCb}
          setSrc={setSrc}
          onLoadMore={onLoadMore}
        />

        {replyToReply === reply._id ? (
          <PostEditor
            onSubmit={set}
            data={ids.length > 2 ? { replyId: ids[1] } : { replyId: reply._id }}
            value={{ content: reply.name + " ", attach: [] }}
            inClass={"reply-to-reply"}
          />
        ) : null}
      </div>
    </>
  );
};
