import React, { useState } from "react";
import { useRef } from "react";
import { tryRequire, typeOf } from "../../services/util.service";

export const Attachments = ({
  attachments,
  set,
  setPreview,
  max = 3,
  id,
  style,
  inClass,
}) => {
  const el = useRef(null);
  const [activeId, setActiveId] = useState(null);
  if (!attachments?.length) return null;
  // const re = new RegExp(`(?<=\\<{2})\\b\\w+:((?!<|>).*?)(?=\\>{2})`, "gm");
  const re = new RegExp(`(\\<{2})\\b\\w+:((?!<|>).*?)(?=\\>{2})`, "gm");
  const data =
    typeOf(attachments) === "Array" ? attachments.join("|") : attachments;
  const els = data.match(re).slice(0, 3);
  return (
    <div
      className={`community-attachments ${set ? "edit-mode" : ""} ${inClass}`}
      style={style}
      ref={el}
    >
      {els.map((att, idx) => {
        const perLine = Math.min(Math.floor(window.innerWidth / 150), max);
        const mainRowCount =
          els.length % Math.min(perLine, els.length) ||
          Math.min(perLine, els.length);
        const style =
          idx < mainRowCount
            ? { maxWidth: `calc(${100 / mainRowCount}% - 8px)` }
            : { maxWidth: `calc(${100 / perLine}% - 8px)` };
        const key = att.match(/^<<\w+/gi);
        if (!key?.length) return null;
        const url = att.slice(key[0].length + 1);
        switch (key[0].slice(2)) {
          case "image":
            return (
              <div style={style} key={`ATTACH_MEDIA_${id}_${idx}`}>
                <img
                  className="attach"
                  src={url}
                  onClick={(ev) => {
                    ev.stopPropagation();
                    setPreview(att);
                  }}
                />
                {set ? (
                  <div className="attach-menu">
                    <img
                      src={tryRequire("imgs/icons/options.svg")}
                      onClick={() => setActiveId(activeId === idx ? null : idx)}
                    />
                    {activeId === idx ? (
                      <div>
                        <button
                          onClick={() =>
                            set([...attachments.filter((att, i) => i !== idx)])
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
          case "video":
            return null;
        }
      })}
    </div>
  );
};
