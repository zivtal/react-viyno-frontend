import React, { useState } from "react";
import { useRef } from "react";
import { tryRequire } from "../../services/require.service";

export interface Attachment {
  url?: string;
  fileName?: string;
  fileData?: string;
  fileType?: string;
}

interface AttachmentsProps extends React.HTMLAttributes<HTMLDivElement> {
  attachments: Array<Attachment>;
  max?: number;
  onSet?: Function;
  onPreview?: Function;
}

export const Attachments = ({
  attachments,
  max = 3,
  onSet,
  onPreview,
  ...attr
}: AttachmentsProps) => {
  const el = useRef(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  if (!attachments?.length) {
    return null;
  }

  return (
    <div
      ref={el}
      {...attr}
      className={`attachments ${!onSet || "attachments__editable"}`}
    >
      {attachments.map((attachment, idx) => {
        const perLine = Math.min(Math.floor(window.innerWidth / 150), max);

        const mainRowCount =
          attachments.length % Math.min(perLine, attachments.length) ||
          Math.min(perLine, attachments.length);

        const style =
          idx < mainRowCount
            ? { maxWidth: `calc(${100 / mainRowCount}% - 8px)` }
            : { maxWidth: `calc(${100 / perLine}% - 8px)` };

        if (onSet) {
          style.maxWidth = `min(${style.maxWidth} , 150px)`;
        }

        return (
          <div style={style} key={`ATTACH_MEDIA_${idx}`}>
            <img
              className="attach"
              src={attachment.url}
              onClick={(ev) => {
                ev.stopPropagation();
                onPreview?.(attachment.url);
              }}
            />

            {onSet ? (
              <div className="attach-menu">
                <img
                  src={tryRequire("imgs/icons/options.svg")}
                  onClick={() => setActiveId(activeId === idx ? null : idx)}
                />
                {activeId === idx ? (
                  <div>
                    <button
                      onClick={() =>
                        onSet([...attachments.filter((_, i) => i !== idx)])
                      }
                    >
                      Remove
                    </button>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
