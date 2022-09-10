import moment from "moment";
import React from "react";
import { tryRequire } from "../../../../shared/helpers/require";
import { FullPost } from "../../models/post.model";
import ImageService from "../../../../shared/services/image.service";

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
            ? ImageService.fromBase64(userPhoto)
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
