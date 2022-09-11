import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPostReaction } from '../../store/action';
import { MainState } from '../../../../store/models/store.models';
import { FullPost } from '../../models/post.model';
import { CustomButton } from '../../../../components/CustomButton/CustomButton';
import { Id } from '../../../../shared/interfaces/id';

interface Props {
  post: FullPost;
  activeId: Id;
  setActiveId: (id: Id) => void;
  setAuthCb?: (callback: () => void) => void;
}

export const PostUserControl = (props: Props) => {
  const dispatch = useDispatch();
  const user = useSelector((state: MainState) => state.authModule.user);

  const setLike = (data: FullPost) => {
    if (!user) {
      return;
    }

    dispatch(setPostReaction(data._id, !!data?.ilike));
  };

  return (
    <div className="review-comments">
      <CustomButton
        label={props.post.likes}
        iconName={props.post.ilike ? 'ilike' : 'like'}
        minWidth={50}
        onClick={() => {
          user ? setLike(props.post) : props.setAuthCb?.(() => setLike(props.post));
        }}
      />

      <CustomButton
        label={props.post.replies}
        iconName="comment"
        minWidth={50}
        onClick={() => props.setActiveId(props.post._id && props.activeId !== props.post._id ? props.post._id : null)}
      />
    </div>
  );
};
