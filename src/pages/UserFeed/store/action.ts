import { postService } from "../service/post.api-service";
import {
  SET_POSTS,
  SET_POST_STATE_LOADING,
  GET_POSTS,
  GET_REPLIES,
  SET_REPLIES,
  SET_REACTION,
  SET_MY_REVIEWS,
  UPDATE_POSTS,
} from "./types";
import { BaseQueries } from "../../../shared/models/base-queries";
import { FullPost } from "../models/post.model";
import { container } from "tsyringe";
import PostApiService from "../service/post.service2";
import { Pagination } from "../../../shared/models/pagination";
import { MY_WINE_REVIEWS } from "../../Wine/store/types";

// const postApiService = container.resolve(PostApiService);

export function getPostsUpdate(page?: Pagination) {
  return async (dispatch: Function, state: Function) => {
    const lastPostId = state().postModule.posts.data[0]?._id;

    try {
      const posts = await postService[GET_POSTS]({
        page,
        filter: { gt_id: lastPostId },
      });

      dispatch({ type: UPDATE_POSTS, posts });

      if (posts.page.total - 1 > posts.page.index) {
        getPostsUpdate({ ...posts.page, index: posts.page.index++ });
      }
    } catch (err) {
      console.error(err);
    }
  };
}

export function getPosts(queries?: BaseQueries) {
  return async (dispatch: Function, state: Function) => {
    const { filter, sort, page } = state().postModule.posts;

    try {
      if (page.index && page.index === page.total - 1) {
        return;
      }

      page.index = page.index + 1 || 0;
      dispatch({ type: SET_POST_STATE_LOADING, loading: true });
      const posts = await postService[GET_POSTS]({
        filter,
        sort,
        page,
        ...(queries || {}),
      });
      dispatch({ type: SET_POSTS, posts });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_POST_STATE_LOADING, loading: false });
    }
  };
}

export function getReplies(postId?: string | number) {
  if (!postId) {
    return;
  }

  return async (dispatch: Function, state: Function) => {
    try {
      const review = state().postModule.posts.data.find(
        (post: FullPost) => post._id === postId
      );

      const page = review?.reply?.page;

      if (page && page.index >= page.total - 1) {
        return;
      }

      const queries = page
        ? { page: { ...page, index: page.index + 1 || 0, size: 3 } }
        : { page: { index: 0, size: 3 } };
      const replies = await postService[GET_REPLIES](postId, queries);

      dispatch({ type: SET_REPLIES, postId, replies });
    } catch (err) {
      console.error(err);
    }
  };
}

export function setPostReaction(
  id?: number,
  state?: number | boolean,
  wineId?: number
) {
  if (!id) {
    return;
  }

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

export function getMyReviews() {
  return async (dispatch: Function, state: Function) => {
    const user = state().authModule.user;

    if (!user) {
      dispatch({ type: SET_MY_REVIEWS, [MY_WINE_REVIEWS]: [] });
      return;
    }

    try {
      dispatch({ type: SET_POST_STATE_LOADING, loading: true });
      // const res = await postService[GET_MY_REVIEWS](id, {
      //   sort: { createdAt: 0 },
      // });
      // dispatch({ type: SET_MY_REVIEWS, [MY_REVIEWS]: res });
    } catch (err) {
      console.error(err);
    } finally {
      dispatch({ type: SET_POST_STATE_LOADING, loading: false });
    }
  };
}
