import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { tryRequire } from "../../../../services/require.service";
import { Attachments } from "../../../../components/Attachments/Attachments";
import { cleanUpEmptyFields } from "../../../../services/object.service";
import { Loader } from "../../../../components/Loader/Loader";
import {
  cloudUpload,
  getImgSrcFromBase64,
} from "../../../../services/media/media.service";
import { MainState } from "../../../../store/models/store.models";

export const PostEditor = ({ onSubmit, value, data, max = 512, inClass }) => {
  const el = useRef(null);
  const user = useSelector((state: MainState) => state.authModule.user);
  const [height, setHeight] = useState(1.25);
  const [isUploading, setUploading] = useState(false);
  const [post, setPost] = useState({
    content: value?.description || "",
    attach: value?.attach || [],
  });

  if (!user) return null;

  const beforeSubmit = () => {
    const res = {
      _id: post._id || null,
      description: post.description,
      attach: (post.attach || []).map(({ url }) => url).join("|"),
      ...(data || {}),
    };
    return cleanUpEmptyFields(res);
  };

  const setContent = (value) => {
    setPost({ ...post, description: value });
    const lineSize = 1.25;
    const width = el.current.getBoundingClientRect()?.width; // 679 = 90
    const height =
      value?.split("\n").reduce((sum, val) => {
        const lines = val.length ? Math.ceil(val.length / (width / 7.55)) : 1;
        return (sum += lines * lineSize);
      }, 0) || 0;
    setHeight(Math.max(height, 1.25));
  };

  const handleKey = (ev) => {
    switch (ev.keyCode) {
      case 13:
        if (ev.ctrlKey) {
          setContent(post.description ? post.description + "\n" : "\n");
        } else {
          ev.preventDefault();
          onSubmit(beforeSubmit(), true);
          setPost({ description: "", attach: [] });
        }
        break;

      case 27:
        onSubmit(beforeSubmit(), false);
        setPost({ description: "", attach: [] });
        break;

      default:
        break;
    }
  };

  const handleChange = ({ target }) => {
    const { value } = target;
    setContent(value);
    // setPost({ ...post, description: value });
  };

  const upload = async (ev, type) => {
    setUploading(true);
    const urls = await cloudUpload(ev.target.files, type);
    setPost({
      ...post,
      attach: [...post.attach, ...urls.map((url: string) => ({ url }))],
    });
    setUploading(false);
  };

  return (
    <>
      <div className={`user-post-editor ${inClass || ""}`}>
        <div>
          <img
            className="profile-picture"
            src={getImgSrcFromBase64(user.imageData, user.imageType)}
            onError={(ev) =>
              (ev.target.src = tryRequire("imgs/icons/user-profile.svg"))
            }
            alt="Profile picture"
          />

          <div>
            <textarea
              ref={el}
              placeholder="Leave a comment"
              onKeyDown={handleKey}
              onChange={handleChange}
              value={post.description}
              spellCheck={false}
              autoFocus={data?.key === "replyId"}
              style={{ height: `calc(${height}em + 32px)` }}
              maxLength={max}
            />

            <label>
              <p className="chars-left">
                {max - (post.description?.length || 0)}
              </p>
            </label>

            {post?.attach?.length ? (
              <Attachments
                attachments={post?.attach || []}
                id={data?.id}
                onSubmit={(attach) => setPost({ ...post, attach })}
              />
            ) : null}
          </div>
        </div>

        <div className="button-control">
          <Loader if={isUploading} type="float-1" size={36} />

          <label className="community-button">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(ev) => upload(ev, "image")}
              hidden
            />

            <img
              src={tryRequire("imgs/icons/add-image.svg")}
              alt="Upload image"
            />
          </label>

          <button
            className="send-button"
            onClick={() => {
              onSubmit(beforeSubmit(), true);
              setPost({ description: "", attach: [] });
            }}
          >
            <span>Send</span>

            <img
              className="send-button"
              src={tryRequire("imgs/icons/send.svg")}
              alt="Submit"
            />
          </button>
        </div>
      </div>
    </>
  );
};
