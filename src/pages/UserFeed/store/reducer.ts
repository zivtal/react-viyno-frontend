import {
  ADD_POST,
  CLEAR_WINE_REVIEWS,
  HELPFUL_REVIEWS,
  MY_REVIEWS,
  POSTS,
  RECENT_REVIEWS,
  SET_CACHE_POSTS,
  SET_HELPFUL_REVIEWS,
  SET_MY_REVIEWS,
  SET_POST_STATE_LOADING,
  SET_POSTS,
  SET_REACTION,
  SET_RECENT_REVIEWS,
  SET_REPLIES,
} from "./types";
import { Post } from "../models/post";
import { BaseRecords } from "../../../shared/models/base-records.model";

interface ReducerAction {
  type: string;
  [key: string]: any;
}

export interface PostState {
  [POSTS]: BaseRecords<Post>;
  [MY_REVIEWS]: BaseRecords<Post>;
  [HELPFUL_REVIEWS]: BaseRecords<Post>;
  [RECENT_REVIEWS]: BaseRecords<Post>;
  loading: boolean;
}

const INITIAL_STATE: PostState = {
  [POSTS]: {
    data: [],
    page: {},
    total: 0,
  },
  [MY_REVIEWS]: {
    data: [],
    page: {},
    total: 0,
  },
  [HELPFUL_REVIEWS]: {
    data: [],
    page: {},
    total: 0,
  },
  [RECENT_REVIEWS]: {
    data: [],
    page: {},
    total: 0,
  },
  loading: false,
};

export default (state = INITIAL_STATE, action: ReducerAction) => {
  switch (action.type) {
    case SET_POSTS: {
      return {
        ...state,
        [POSTS]: {
          data: [...state[POSTS].data, ...(action.posts?.data || [])],
          page: { ...action.posts?.page },
          total: action.posts?.total,
        },
      };
    }

    case ADD_POST: {
      return {
        ...state,
        [POSTS]: [action.post, ...state[POSTS].data].slice(-1),
      };
    }

    case SET_REPLIES: {
      const { postId, replies } = action;

      const _update = (
        posts: BaseRecords<Post>,
        replies: BaseRecords<Post>,
        postId: number
      ): BaseRecords<Post> => {
        return {
          ...posts,
          data: posts.data.map((data: Post) => {
            if (data._id === postId) {
              return {
                ...data,
                reply: {
                  ...(data.reply || {}),
                  data: [...(data.reply?.data || []), ...replies.data],
                  page: replies.page,
                  total: replies.total,
                },
              };
            }

            return data.reply
              ? {
                  ...data,
                  reply: _update(data.reply, replies, postId),
                }
              : data;
          }),
        };
      };

      return {
        ...state,
        [POSTS]: _update(state[POSTS], replies, postId),
      };
    }

    case SET_MY_REVIEWS: {
      return {
        ...state,
        [MY_REVIEWS]: action[MY_REVIEWS] || INITIAL_STATE[MY_REVIEWS],
      };
    }

    case SET_RECENT_REVIEWS: {
      if (!action[RECENT_REVIEWS]) {
        return {
          ...state,
          [RECENT_REVIEWS]: INITIAL_STATE[RECENT_REVIEWS],
        };
      }

      return {
        ...state,
        [RECENT_REVIEWS]: action[RECENT_REVIEWS]?.page?.index
          ? {
              ...action[RECENT_REVIEWS],
              data: [
                ...action[RECENT_REVIEWS]?.data,
                ...(state[RECENT_REVIEWS]?.data || []),
              ],
            }
          : action[RECENT_REVIEWS],
      };
    }

    case SET_HELPFUL_REVIEWS: {
      if (!action[HELPFUL_REVIEWS]) {
        return {
          ...state,
          [HELPFUL_REVIEWS]: INITIAL_STATE[HELPFUL_REVIEWS],
        };
      }

      return {
        ...state,
        [HELPFUL_REVIEWS]: action[HELPFUL_REVIEWS]?.page?.index
          ? {
              ...action[HELPFUL_REVIEWS],
              data: [
                ...action[HELPFUL_REVIEWS]?.data,
                ...(state[HELPFUL_REVIEWS]?.data || []),
              ],
            }
          : action[HELPFUL_REVIEWS],
      };
    }

    case CLEAR_WINE_REVIEWS: {
      return {
        ...state,
        [MY_REVIEWS]: INITIAL_STATE[MY_REVIEWS],
        [RECENT_REVIEWS]: INITIAL_STATE[RECENT_REVIEWS],
        [HELPFUL_REVIEWS]: INITIAL_STATE[HELPFUL_REVIEWS],
      };
    }

    case SET_CACHE_POSTS: {
      return {
        ...state,
      };
    }

    case SET_POST_STATE_LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }

    case SET_REACTION: {
      const { _id, ilike } = action.like;

      const _update = (
        posts: BaseRecords<Post>,
        like: boolean,
        postId: number
      ): BaseRecords<Post> => {
        return {
          ...posts,
          data: posts.data.map((data: Post) => {
            if (data._id === postId) {
              const ilike = like ? 1 : 0;
              const likes = () => {
                if (ilike === data?.ilike) {
                  return data.likes;
                }

                return data.likes + (ilike ? +1 : -1);
              };

              return {
                ...data,
                ilike,
                likes: likes(),
              };
            }

            return data.reply
              ? {
                  ...data,
                  reply: _update(data.reply, like, postId),
                }
              : data;
          }),
        };
      };

      // const _update = (
      //   id: number,
      //   like: boolean,
      //   posts: Array<Post>,
      //   index: number = 0
      // ): any => {
      //   return posts.map((post: Post) => {
      //     if (post._id === id && post.ilike !== (like ? 1 : 0)) {
      //       return {
      //         ...post,
      //         ilike: like ? 1 : 0,
      //         likes: post.likes + (like ? +1 : -1),
      //       };
      //     }
      //
      //     if (post.reply?.data?.length) {
      //       return {
      //         ...post,
      //         reply: {
      //           ...post.reply,
      //           data: _update(id, like, post?.reply?.data || [], type, ++index),
      //         },
      //       };
      //     }
      //
      //     return post;
      //   });
      // };

      return {
        ...state,
        [POSTS]: _update(state[POSTS], ilike, _id),
        [MY_REVIEWS]: _update(state[MY_REVIEWS], ilike, _id),
        [RECENT_REVIEWS]: _update(state[RECENT_REVIEWS], ilike, _id),
        [HELPFUL_REVIEWS]: _update(state[HELPFUL_REVIEWS], ilike, _id),
      };
    }

    default:
      return state;
  }
};
