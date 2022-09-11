import { useEffect } from 'react';
import { useLayoutEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostEditor } from './components/PostEditor/PostEditor';
import { PostPreview } from './components/PostPreview/PostPreview';
import { ReviewPreview } from '../Wine/WineView/components/WineCommunityReviews/components/ReviewPreview/ReviewPreview';
import { WineSlider } from '../Wine/WineView/components/WineSlider/WineSlider';
import { postService } from './service/post.api-service';
import { Loader } from '../../components/Loader/Loader';
import { getPosts, getPostsUpdate, getReplies } from './store/action';
import { getWines } from '../Wine/store/action';
import { REVIEW_DEMO } from '../Wine/WineView/constants/wine';
import { SET_POST, POSTS } from './store/types';
import { WINES } from '../Wine/store/types';
import { MainState } from '../../store/models/store.models';
import useInfinityScroll from '../../shared/hooks/useInfinityScroll';
import './UserFeed.scss';
import { authService } from '../Login/service/auth.service';
import { useLocation } from 'react-router-dom';
import React from 'react';
import { FullPost, Reply } from './models/post.model';
import { Id } from '../../shared/interfaces/id';
import CryptService from '../../shared/services/crypt.service';

interface UserProps {
  loading?: boolean;
  reviews?: Array<FullPost>;
  activeId: Id;
  setActiveId: (id: Id) => void;
}

export const UserFeed = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: MainState) => state.authModule.user);

  const { [WINES]: wines, loading: winesLoading } = useSelector((state: MainState) => state.wineModule);

  const { [POSTS]: posts, loading: postsLoading } = useSelector((state: MainState) => state.postModule);

  const [postActiveId, setPostActiveId] = useState<Id>(null);

  useLayoutEffect(() => {
    if (wines?.length) {
      return;
    }

    (async () => {
      dispatch(getWines());
    })();
  }, []);

  useEffect(() => {
    if (!posts.data?.length) {
      (async () => {
        dispatch(getPosts());
      })();
    }

    (async () => {
      dispatch(getPostsUpdate());
    })();
  }, [location.pathname]);

  useInfinityScroll(
    async () => {
      dispatch(getPosts());
    },
    [posts.data],
    (posts.page?.index || 0) < (posts.page?.total || 0) && location.pathname === '/'
  );

  useEffect(() => {
    if (!postActiveId) {
      return;
    }

    dispatch(getReplies(postActiveId));
  }, [postActiveId]);

  const UserFeed = (props: UserProps) => {
    const [saved, setSaved] = useState<Reply>({} as Reply);

    const submit = async (post: Reply, isSave: boolean) => {
      if (isSave) {
        setSaved(post);
      }

      if (!post.description && !post.attach?.length) {
        return;
      }

      try {
        const postRes = await postService[SET_POST](post);
        const userInfo = authService.getUserInformation();

        dispatch({ type: SET_POST, post: { ...postRes, ...userInfo } });
      } catch (err) {
        setSaved(post);
      }
    };

    const data = !props.loading ? props?.reviews || [] : Array(8).fill(REVIEW_DEMO);

    return (
      <section className="user-feed">
        <PostEditor onSubmit={submit} />

        {(data || []).map((review: FullPost, index: number) =>
          review.wine ? (
            <ReviewPreview key={index} review={review} activeId={postActiveId} setActiveId={setPostActiveId} />
          ) : (
            <PostPreview key={index} post={review} activeId={postActiveId} setActiveId={setPostActiveId} />
          )
        )}
      </section>
    );
  };

  return (
    <>
      <section className="story-line-wines">
        <WineSlider wines={wines} loading={winesLoading} />
      </section>

      <Loader if={!posts.data.length && postsLoading} type="overlay-skeleton" demo={REVIEW_DEMO}>
        <UserFeed reviews={posts?.data} activeId={postActiveId} setActiveId={setPostActiveId} />
      </Loader>

      <Loader if={postsLoading} type="float-1" size={50} />
    </>
  );
};
