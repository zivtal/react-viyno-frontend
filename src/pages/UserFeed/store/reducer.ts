import {
  SET_POST,
  POSTS,
  SET_CACHE_POSTS,
  SET_POST_STATE_LOADING,
  SET_POSTS,
  SET_REACTION,
  SET_REPLIES,
  UPDATE_POSTS,
  UPDATE_REPLIES,
  CACHE_POSTS,
} from "./types";
import { FullPost } from "../models/post.model";
import { BaseRecords } from "../../../shared/models/base-records.model";
import { baseRecords } from "../../../services/base-records.service";

interface ReducerAction {
  type: string;
  [key: string]: any;
}

export interface PostState {
  [POSTS]: BaseRecords<FullPost>;
  loading: boolean;
}

const INITIAL_STATE: PostState = {
  [POSTS]: {
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

    case UPDATE_POSTS: {
      const newPosts = action.posts?.data || [];

      return {
        ...state,
        [POSTS]: {
          ...state[POSTS],
          data: [...newPosts, ...state[POSTS].data].slice(
            0,
            state[POSTS].data.length
          ),
        },
      };
    }

    case SET_POST: {
      const { post } = action;
      const count = state[POSTS].data?.length;
      const data = [post, ...state[POSTS].data].slice(0, count);

      return post
        ? {
            ...state,
            [POSTS]: baseRecords.addData<FullPost>([post], state[POSTS]),
          }
        : state;
    }

    case SET_REPLIES: {
      const { postId, replies } = action;

      const _update = (
        posts: BaseRecords<FullPost>,
        replies: BaseRecords<FullPost>,
        postId: number
      ): BaseRecords<FullPost> => {
        return {
          ...posts,
          data: posts.data.map((data: FullPost) => {
            if (data._id === postId) {
              return {
                ...data,
                reply: {
                  ...(data.reply || {}),
                  data: [...(data.reply?.data || []), ...replies.data],
                  page: replies.page || data.reply?.page || 0,
                  total: replies.total || data.reply?.total || 0,
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

      return {
        ...state,
        [POSTS]: baseRecords.update<FullPost>(
          state[POSTS],
          {
            key: "_id",
            value: _id,
            recursiveKey: "reply",
          },
          { ilike: ilike ? 1 : 0 },
          { likes: "ilike" }
        ),
      };
    }

    case UPDATE_REPLIES: {
      const { reply } = action;
      console.log("update", reply);

      return {
        ...state,
      };
    }

    default:
      return state;
  }
};
