import { postService } from "../service/post.api-service";
import {
  SET_POSTS,
  SET_POST_STATE_LOADING,
  GET_POSTS,
  GET_REPLIES,
  SET_REPLIES,
  SET_REACTION,
  GET_MY_REVIEWS,
  SET_MY_REVIEWS,
  GET_RECENT_REVIEWS,
  MY_REVIEWS,
  SET_RECENT_REVIEWS,
  RECENT_REVIEWS,
  SET_HELPFUL_REVIEWS,
  HELPFUL_REVIEWS,
  GET_HELPFUL_REVIEWS,
} from "./types";
import { BaseQueries } from "../../../shared/models/base-queries";
import { Post } from "../models/post.model";
import { container } from "tsyringe";
import PostApiService from "../service/post.service2";

// const postApiService = container.resolve(PostApiService);

export function getPosts(queries?: BaseQueries) {
  return async (dispatch: Function, state: Function) => {
    try {
      const page = state().postModule.posts.page;
      dispatch({ type: SET_POST_STATE_LOADING, loading: true });

      if (!queries && page?.total && page?.index < page?.total) {
        queries = { page: { index: page.index + 1 } };
      }

      const posts = await postService[GET_POSTS](queries);
      dispatch({ type: SET_POSTS, posts });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_POST_STATE_LOADING, loading: false });
    }
  };
}

export function getReplies(postId: number) {
  return async (dispatch: Function, state: Function) => {
    try {
      const review = state().postModule.posts.data.find(
        (post: Post) => post._id === postId
      );

      const page = review?.reply?.page;

      if (page && page.index >= page.total - 1) {
        return;
      }

      const queries = page
        ? { page: { ...page, index: page.index + 1, size: 3 } }
        : { page: { size: 3 } };
      const replies = await postService[GET_REPLIES](postId, queries);

      dispatch({ type: SET_REPLIES, postId, replies });
    } catch (err) {
      console.error(err);
    }
  };
}

export function setPostReaction(id: number, state: number | boolean) {
  return async (dispatch: Function) => {
    try {
      const res = await postService[SET_REACTION](id, {
        like: state ? false : true,
      });

      dispatch({ type: SET_REACTION, like: { ...res } });
    } catch (err) {
      console.error(err);
    }
  };
}

export function getMyReviews(id?: string | number) {
  return async (dispatch: Function, state: Function) => {
    const user = state().authModule.user;

    if (!id || !user) {
      dispatch({ type: SET_MY_REVIEWS, [MY_REVIEWS]: [] });
      return;
    }

    try {
      dispatch({ type: SET_POST_STATE_LOADING, loading: true });
      const res = await postService[GET_MY_REVIEWS](id, {
        sort: { createdAt: 0 },
      });
      dispatch({ type: SET_MY_REVIEWS, [MY_REVIEWS]: res });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_POST_STATE_LOADING, loading: false });
    }
  };
}

export function getRecentReviews(
  id?: string | number,
  vintage?: number,
  force?: boolean
) {
  return async (dispatch: Function, state: Function) => {
    const queries = vintage ? { filter: { eqVintage: vintage } } : {};

    if (!id) {
      dispatch({ type: SET_RECENT_REVIEWS, [RECENT_REVIEWS]: [] });
      return;
    }

    const index = force
      ? undefined
      : state().postModule[RECENT_REVIEWS]?.page?.index;

    try {
      dispatch({ type: SET_POST_STATE_LOADING, loading: true });
      const res = await postService[GET_RECENT_REVIEWS](id, {
        ...queries,
        page: { index: index !== undefined ? index + 1 : 0 },
        sort: { createdAt: 0 },
      });
      dispatch({ type: SET_RECENT_REVIEWS, [RECENT_REVIEWS]: res });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_POST_STATE_LOADING, loading: false });
    }
  };
}

export function getHelpfulReviews(
  id?: string | number,
  vintage?: number,
  force?: boolean
) {
  return async (dispatch: Function, state: Function) => {
    const queries = vintage ? { filter: { eqVintage: vintage } } : {};

    if (!id) {
      dispatch({ type: SET_HELPFUL_REVIEWS, [HELPFUL_REVIEWS]: [] });
      return;
    }

    const index = force
      ? undefined
      : state().postModule[RECENT_REVIEWS]?.page?.index;

    try {
      dispatch({ type: SET_POST_STATE_LOADING, loading: true });
      const res = await postService[GET_HELPFUL_REVIEWS](id, {
        ...queries,
        page: { index: index !== undefined ? index + 1 : 0 },
        sort: { createdAt: 0 },
      });
      dispatch({ type: SET_HELPFUL_REVIEWS, [HELPFUL_REVIEWS]: res });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_POST_STATE_LOADING, loading: false });
    }
  };
}
