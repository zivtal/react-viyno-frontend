import { useSelector } from "react-redux";
import {
  Attachment,
  Attachments,
} from "../../../../components/Attachments/Attachments";
import { cleanUpEmptyFields } from "../../../../services/object.service";
import {
  cloudUpload,
  getImgSrcFromBase64,
} from "../../../../services/media/media.service";
import { MainState } from "../../../../store/models/store.models";
import { CustomButton } from "../../../../components/CustomButton/CustomButton";
import { Post, Reply } from "../../models/post.model";
import { useRef, useState } from "react";
import React from "react";

interface Props {
  value?: Post;
  data?: Partial<Reply>;
  max?: number;
  onSubmit: Function;
  inClass?: string;
}

export const PostEditor = (props: Props) => {
  const el = useRef<HTMLTextAreaElement | null>(null);
  const user = useSelector((state: MainState) => state.authModule.user);
  const [height, setHeight] = useState(1.25);
  const [isUploading, setUploading] = useState(false);
  const [post, setPost] = useState<Post>({ ...(props.value || {}) } as Post);

  if (!user) return null;

  const beforeSubmit = () => {
    const req = {
      _id: post?._id || null,
      description: post.description,
      attach: post?.attach,
      ...(props.data || {}),
    };

    return cleanUpEmptyFields(req);
  };

  const setContent = (value: string) => {
    setPost({ ...post, description: value });
    const lineSize = 1.25;
    const width = el.current?.getBoundingClientRect()?.width; // 679 = 90
    const height =
      value?.split("\n").reduce((sum: number, val: string) => {
        const lines = val.length
          ? Math.ceil(val.length / ((width || 1) / 7.55))
          : 1;
        return (sum += lines * lineSize);
      }, 0) || 0;
    setHeight(Math.max(height, 1.25));
  };

  const handleKey = (ev: any) => {
    switch (ev.keyCode) {
      case 13:
        if (ev.ctrlKey) {
          setContent(post.description ? post.description + "\n" : "\n");
        } else {
          ev.preventDefault();
          props.onSubmit(beforeSubmit(), true);
          setPost({ description: "", attach: [] });
        }
        break;

      case 27:
        props.onSubmit(beforeSubmit(), false);
        setPost({ description: "", attach: [] });
        break;

      default:
        break;
    }
  };

  const handleChange = (ev: any) => {
    const { value } = ev.target;
    setContent(value);
    setPost({ ...post, description: value });
  };

  const upload = async (ev: any, type: string) => {
    setUploading(true);
    const urls = await cloudUpload(ev.target.files, type);
    setPost({
      ...post,
      attach: [...(post.attach || []), ...urls.map((url: string) => ({ url }))],
    });
    setUploading(false);
  };

  return (
    <>
      <div className={`user-post-editor ${props.inClass || ""}`}>
        <div>
          <img
            className="profile-picture"
            src={getImgSrcFromBase64(user.imageData, user.imageType)}
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
              autoFocus={!!props.data?.replyId}
              style={{ height: `calc(${height}em + 32px)` }}
              maxLength={props.max || 512}
            />

            <label>
              <p className="chars-left">
                {(props.max || 512) - (post.description?.length || 0)}
              </p>
            </label>

            {post?.attach?.length ? (
              <Attachments
                attachments={post?.attach || []}
                onSet={(attach: Array<Attachment>) =>
                  setPost({ ...post, attach })
                }
              />
            ) : null}
          </div>
        </div>

        <div className="button-control">
          <CustomButton iconName="add-image" loading={isUploading}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(ev) => upload(ev, "image")}
              hidden
            />
          </CustomButton>

          <CustomButton
            label="Send"
            iconName="send"
            iconSize={12}
            loading={isUploading}
            onClick={() => {
              props.onSubmit(beforeSubmit(), true);
              setPost({ description: "", attach: [] });
            }}
          />
        </div>
      </div>
    </>
  );
};
