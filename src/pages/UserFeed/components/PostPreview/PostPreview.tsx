import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MediaPreviewModal } from '../../../../components/MediaPreviewModal/MediaPreviewModal';
import { QuickLogin } from '../../../Login/components/QuickLogin/QuickLogin';
import { Attachments } from '../../../../components/Attachments/Attachments';
import { PostUserControl } from '../PostUserControl/PostUserControl';
import { OnPostReply } from '../../../Wine/WineView/components/WineCommunityReviews/components/OnPostReply/OnPostReply';
import { PostUserInfo } from '../PostUserInfo/PostUserInfo';
import { MainState } from '../../../../store/models/store.models';
import { FullPost, Post, Reply } from '../../models/post.model';
import { postService } from '../../service/post.api-service';
import { SET_REPLIES, SET_REPLY, UPDATE_REPLIES } from '../../store/types';
import React from 'react';
import { authService } from '../../../Login/service/auth.service';
import { Id } from '../../../../shared/interfaces/id';

interface Props {
  post: FullPost;
  activeId: Id;
  setActiveId: (id: Id) => void;
}

interface SavedReply {
  description: string;
  attach?: string;
}

export const PostPreview = (props: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.authModule.user);
  const [authCb, setAuthCb] = useState<() => void | undefined>();
  const [savedReply, setSavedReply] = useState<Post | undefined>(undefined);
  const [src, setSrc] = useState<string | null>(null);

  if (!props.post?._id) {
    return null;
  }

  const setReply = async (reply: Reply, isSubmit: boolean) => {
    setSavedReply({ description: reply.description, attach: reply.attach });
    if (isSubmit && user) {
      try {
        const replyRes = await postService[SET_REPLY]({
          ...reply,
          replyId: props.post?._id,
        } as Reply);

        const userInfo = authService.getUserInformation();

        dispatch({
          type: UPDATE_REPLIES,
          reply: {
            ...replyRes,
            ...userInfo,
          },
        });
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
              ? props.setActiveId(props.post._id && props.activeId !== props.post._id ? props.post._id : null)
              : setAuthCb(() => props.setActiveId(props.post._id && props.activeId !== props.post._id ? props.post._id : null))
          }
        >
          <div className="review-user" style={{ padding: 0 }}>
            <PostUserInfo review={props.post} isMinimal={true} />
          </div>
          <p className="review-desc">{props.post.description}</p>
          {props.post.attach ? (
            <Attachments max={2} attachments={props.post?.attach || []} className={'user-feed-preview'} onPreview={setSrc} />
          ) : null}
        </div>

        <PostUserControl post={props.post} activeId={props.activeId} setActiveId={props.setActiveId} setAuthCb={setAuthCb} />

        {props.activeId === props.post._id ? (
          <OnPostReply post={props.post} value={savedReply} setReply={setReply} setAuthCb={setAuthCb} setSrc={setSrc} />
        ) : null}
      </div>

      <QuickLogin isActive={!!authCb && !user} onClose={() => setAuthCb(undefined)} onLogin={authCb} />
    </>
  );
};
