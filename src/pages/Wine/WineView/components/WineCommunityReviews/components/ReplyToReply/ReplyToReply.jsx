import React from "react";
import { ReplyPreview } from "../ReplyPreview/ReplyPreview";

export const ReplyToReply = ({
  review,
  set,
  ids,
  setAuthCb,
  setSrc,
  onLoadMore,
}) => {
  if (!review) {
    return null;
  }

  const data = review?.reply?.data;

  return (
    <>
      {data?.length
        ? data.map((reply, idx) => (
            <ReplyPreview
              review={review}
              reply={reply}
              idx={idx}
              ids={ids}
              set={set}
              onLoadMore={onLoadMore}
              setAuthCb={setAuthCb}
              setSrc={setSrc}
              key={idx}
            />
          ))
        : null}
    </>
  );
};
