import { mediaQuery } from "../../../AppHeader/AppHeader";
import React from "react";
import { CustomInputResults } from "../../CustomInput";
import { tryRequire } from "../../../../shared/helpers/require";
import { getImgSrcFromBase64 } from "../../../../shared/services/media/media.service";

interface SearchResultsProps {
  value: string;
  results?: Array<CustomInputResults>;
  loading: boolean;
  selected: number | null;
  el?: HTMLElement | undefined | null;
  defaultImage?: string;
  onClose(): void;
  onSelect?(value: any): void;
  onAdd?(text: string): void;
  onChangeSelect?(index: number): void;
}

export const Suggestions = (props: SearchResultsProps): any => {
  if (!props.el || !props.value || !props.results?.length) {
    return null;
  }

  const rtl = document.dir === "rtl";
  const top: number = props.el.offsetTop + props.el.clientHeight + 16;
  const left: number = props.el.offsetLeft;
  const right: number =
    window.innerWidth - (props.el.offsetLeft + props.el.clientWidth);

  const style: any = {
    top: `${top}px`,
    minWidth: `${props.el.clientWidth}px`,
  };

  if (window.innerWidth > mediaQuery.mobile) {
    rtl ? (style.right = `${right}px`) : (style.left = `${left}px`);
  }

  return ((props.results || [])?.length || props.onAdd) && !props.loading ? (
    <div className="custom-input__suggestions hover-box" style={style}>
      <ul>
        {(props.results || []).map((result: any, idx: number) => {
          const re = new RegExp(`(${props.value})`, "gi");

          const html = (text: string) => ({
            __html: text.replace(re, `<span class="bold">$1</span>`),
          });

          return (
            <li
              key={"SEARCH_RESULT_" + idx}
              onClick={() => props.onSelect?.(result.value)}
              className={`${props.selected === idx ? "bold" : ""}`}
              onMouseOver={() => props.onChangeSelect?.(idx)}
            >
              {result.imageData || props.defaultImage ? (
                <img
                  src={
                    getImgSrcFromBase64(result.imageData, result.imageType) ||
                    tryRequire(`imgs/${props.defaultImage}`)
                  }
                />
              ) : null}

              <div className="title">
                <p dangerouslySetInnerHTML={html(result.text)}></p>
              </div>
            </li>
          );
        })}
      </ul>

      {!(props.results || []).length && !props.loading && props.onAdd ? (
        <button onClick={() => props.onAdd?.(props.value)}>
          Add "{props.value}" ...
        </button>
      ) : null}
    </div>
  ) : null;
};
