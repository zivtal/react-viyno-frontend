import moment from "moment";
import React from "react";
import { tryRequire } from "../../../../services/require.service";
import { getImgSrcFromBase64 } from "../../../../services/media/media.service";
import { FullPost } from "../../models/post.model";

interface Props {
  review: FullPost;
  isMinimal?: boolean;
}

export const PostUserInfo = (props: Props) => {
  const { userName, userPhoto, ratings, createdAt } = props.review;

  return (
    <div className="community-user-info">
      <img
        src={
          userPhoto
            ? getImgSrcFromBase64(userPhoto)
            : tryRequire("imgs/icons/user-profile.svg")
        }
        alt="Reviewer profile"
      />
      <p style={props.isMinimal ? { flexDirection: "column" } : {}}>
        <span className="user-fullname">{userName} </span>
        {!props.isMinimal && ratings ? (
          <span className="user-ratings">({ratings} ratings)</span>
        ) : null}
        <span className="post-date"> {moment(createdAt).format("ll")}</span>
      </p>
    </div>
  );
};
