// @ts-ignore
import { httpService } from "../../../services/http-client/http.service";
import {
  SET_POST,
  SET_REVIEW,
  GET_POSTS,
  GET_REPLIES,
  GET_REVIEW_STRUCTURE,
  SET_REACTION,
  SET_REPLY,
  UPDATE_POST,
  UPDATE_REVIEW_STRUCTURE,
} from "../store/types";
import { BaseQueries } from "../../../shared/models/base-queries";
import { WineQuery, WineStructure } from "../../Wine/models/wine.model";
import { FullPost, Post, Reply } from "../models/post.model";
import {
  GET_WINE_HELPFUL_REVIEWS,
  GET_MY_WINE_REVIEWS,
  GET_WINE_RECENT_REVIEWS,
  GET_WINE_REVIEWS,
} from "../../Wine/store/types";

const API = "post";

export const postService = {
  [GET_POSTS]: (queries?: BaseQueries) => {
    return httpService.post(API + "/" + GET_POSTS, queries);
  },

  [GET_REPLIES]: (postId: number, queries?: BaseQueries) => {
    return httpService.post(API + "/" + GET_REPLIES + "/" + postId, queries);
  },

  [GET_REVIEW_STRUCTURE]: (wineId: string | number) => {
    if (!wineId) {
      return;
    }

    return httpService.post(API + "/" + GET_REVIEW_STRUCTURE + "/" + wineId);
  },

  [UPDATE_REVIEW_STRUCTURE]: (
    wineId: string | number,
    content: WineStructure
  ) => {
    return httpService.post(
      API + "/" + UPDATE_REVIEW_STRUCTURE + "/" + wineId,
      content
    );
  },

  [SET_REVIEW]: (post: Partial<FullPost>) => {
    return httpService.post(API + "/" + SET_REVIEW, post);
  },

  [SET_POST]: (post: Partial<Post>) => {
    return httpService.post(API + "/" + SET_POST, post);
  },

  [UPDATE_POST]: (postId: number, content: any, queries?: BaseQueries) => {
    return httpService.post(
      API + "/" + UPDATE_POST + "/" + postId,
      content,
      queries
    );
  },

  [SET_REACTION]: (postId: number, content: any, queries?: any) => {
    return httpService.post(
      API + "/" + SET_REACTION + "/" + postId,
      content,
      queries
    );
  },

  [GET_MY_WINE_REVIEWS]: (wineId: string | number, queries?: WineQuery) => {
    return httpService.post(
      API + "/" + GET_MY_WINE_REVIEWS + "/" + wineId,
      queries
    );
  },

  [GET_WINE_HELPFUL_REVIEWS]: (
    wineId: string | number,
    queries?: WineQuery
  ) => {
    return httpService.post(
      API + "/" + GET_WINE_HELPFUL_REVIEWS + "/" + wineId,
      queries
    );
  },

  [GET_WINE_RECENT_REVIEWS]: (wineId: string | number, queries?: WineQuery) => {
    return httpService.post(
      API + "/" + GET_WINE_RECENT_REVIEWS + "/" + wineId,
      queries
    );
  },

  [SET_REPLY]: (reply: Reply) => {
    return httpService.post(API + "/" + SET_REPLY, reply);
  },

  [GET_WINE_REVIEWS]: (queries: WineQuery) => {
    return httpService.post(API + "/" + GET_WINE_REVIEWS, queries);
  },
};

export const postServiceOld = {
  review,
  post,
  reply,
};

async function review(
  wineId: string | number,
  review: any,
  queries?: { type: string }
) {
  return httpService.post(API + "/" + wineId, review, queries);
}

async function reply(reviewId: number, content: any, queries?: BaseQueries) {
  return httpService.put(API + "/reply/" + reviewId, content, queries);
}

async function post(postId: number, content: any, queries?: BaseQueries) {
  return httpService.post(
    `${API}${postId ? `/${postId}` : ""}`,
    content,
    queries
  );
}
