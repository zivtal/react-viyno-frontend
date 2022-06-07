import {
  ADD_POST,
  POSTS,
  SET_CACHE_POSTS,
  SET_POST_STATE_LOADING,
  SET_POSTS,
  SET_REACTION,
  SET_REPLIES,
  UPDATE_POSTS,
} from "./types";
import { Post } from "../models/post.model";
import { BaseRecords } from "../../../shared/models/base-records.model";
import { baseRecordUpdate } from "../../../services/base-record.service";

interface ReducerAction {
  type: string;
  [key: string]: any;
}

export interface PostState {
  [POSTS]: BaseRecords<Post>;
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
        [POSTS]: baseRecordUpdate<Post>(
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

    default:
      return state;
  }
};
