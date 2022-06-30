import { useEffect } from "react";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import { PostEditor } from "./components/PostEditor/PostEditor";
import { PostPreview } from "./components/PostPreview/PostPreview";
import { ReviewPreview } from "../Wine/WineView/components/WineCommunityReviews/components/ReviewPreview/ReviewPreview";
import { WineSlider } from "../Wine/WineView/components/WineSlider/WineSlider";
import { postService, postServiceOld } from "./service/post.api-service";
import { Loader } from "../../components/Loader/Loader";
import { getPosts, getPostsUpdate, getReplies } from "./store/action";
import { getWines } from "../Wine/store/action";
import { REVIEW_DEMO } from "../Wine/WineView/constants/wine";
import { SET_POST, POSTS } from "./store/types";
import { WINES } from "../Wine/store/types";
import { MainState } from "../../store/models/store.models";
import useInfinityScroll from "../../shared/hooks/useInfinityScroll";
import "./UserFeed.scss";

export const UserFeed = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((state: MainState) => state.authModule.user);

  const { [WINES]: wines, loading: winesLoading } = useSelector(
    (state: MainState) => state.wineModule
  );

  const { [POSTS]: posts, loading: postsLoading } = useSelector(
    (state: MainState) => state.postModule
  );

  const [postActiveId, setPostActiveId] = useState(null);

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
    posts.page?.index < posts.page?.total && location.pathname === "/"
  );

  useEffect(() => {
    if (!postActiveId) {
      return;
    }

    dispatch(getReplies(postActiveId));
  }, [postActiveId]);

  const UserFeed = (props) => {
    const [saved, setSaved] = useState(null);

    const submit = async (post, isSave) => {
      if (isSave) {
        setSaved(post);
      }

      if (!post.description && !post.attach?.length) {
        return;
      }

      try {
        await postService[SET_POST](post);
      } catch (err) {
        setSaved(post);
      }
    };

    const data = !props.loading
      ? props?.reviews || []
      : Array(8).fill(REVIEW_DEMO);

    return (
      <section className="user-feed">
        <PostEditor onSubmit={submit} />

        {(data || []).map((review, index) =>
          review.wine ? (
            <ReviewPreview
              key={index}
              review={review}
              activeId={postActiveId}
              setActiveId={setPostActiveId}
            />
          ) : (
            <PostPreview
              key={index}
              post={review}
              activeId={postActiveId}
              setActiveId={setPostActiveId}
            />
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

      <Loader if={postsLoading && !posts.data.length} type="overlay-skeleton">
        <UserFeed
          reviews={posts?.data}
          activeId={postActiveId}
          setActiveId={setPostActiveId}
        />
      </Loader>

      <Loader if={postsLoading} type="float-1" size={50} />
    </>
  );
};
