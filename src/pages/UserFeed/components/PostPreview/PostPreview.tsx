import { useState } from "react";
import { useSelector } from "react-redux";
import { MediaPreviewModal } from "../../../../components/MediaPreviewModal/MediaPreviewModal";
import { QuickLogin } from "../../../Login/components/QuickLogin/QuickLogin";
import { Attachments } from "../../../../components/Attachments/Attachments";
import { PostUserControl } from "../PostUserControl/PostUserControl";
// @ts-ignore
import { OnPostReply } from "../../../Wine/WineView/components/WineCommunityReviews/components/OnPostReply/OnPostReply";
// @ts-ignore
import { PostUserInfo } from "../PostUserInfo/PostUserInfo";
import { MainState } from "../../../../store/models/store.models";
import { Post } from "../../models/post.model";
import { postService } from "../../service/post.api-service";
import { SET_REPLY } from "../../store/types";
import React from "react";

interface Props {
  post: Post;
  activeId: number | null;
  setActiveId: Function;
  setReplyState: Function;
}

interface SavedReply {
  description: string;
  attach?: string;
}

export const PostPreview = (props: Props) => {
  const user = useSelector((state: MainState) => state.authModule.user);
  const [authCb, setAuthCb] = useState<Function | undefined>();
  const [savedReply, setSavedReply] = useState<SavedReply | null>(null);
  const [src, setSrc] = useState<string | null>(null);

  const setReply = async (reply: Post, isSubmit: boolean) => {
    setSavedReply({ description: reply.description, attach: reply.attach });
    if (isSubmit) {
      try {
        const res = await postService[SET_REPLY]({
          replyId: props.post._id,
          ...reply,
        });
        //console.log("PostPreview", reply);
        // TODO: Update posts after reply
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <MediaPreviewModal url={src} onClose={() => setSrc(null)} />

      <div className="wine-review">
        <div
          className="review-card hover-box"
          onClick={() =>
            user
              ? props.setActiveId(
                  props.activeId === props.post._id ? null : props.post._id
                )
              : setAuthCb(() =>
                  props.setActiveId(
                    props.activeId === props.post._id ? null : props.post._id
                  )
                )
          }
        >
          <div className="review-user" style={{ padding: 0 }}>
            <PostUserInfo review={props.post} isMinimal={true} />
          </div>
          <p className="review-desc">{props.post.description}</p>
          {props.post.attach ? (
            <Attachments
              max={2}
              attachments={props.post?.attach
                ?.split("|")
                .map((url) => ({ url }))}
              className={"user-feed-preview"}
              onPreview={setSrc}
            />
          ) : null}
        </div>

        <PostUserControl
          post={props.post}
          activeId={props.activeId}
          setActiveId={props.setActiveId}
          setAuthCb={setAuthCb}
        />

        {props.activeId === props.post._id ? (
          <OnPostReply
            review={props.post}
            value={savedReply}
            setReply={setReply}
            setAuthCb={setAuthCb}
            setSrc={setSrc}
            setReplyState={props.setReplyState}
          />
        ) : null}
      </div>

      <QuickLogin
        isActive={!!authCb && !user}
        onClose={() => setAuthCb(undefined)}
        onLogin={authCb}
      />
    </>
  );
};
