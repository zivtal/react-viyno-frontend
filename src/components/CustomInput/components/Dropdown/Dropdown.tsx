import { mediaQuery } from "../../../AppHeader/AppHeader";
import React from "react";
import { CustomInputDropdown } from "../../CustomInput";

interface DropdownProps {
  value: string;
  items?: Array<CustomInputDropdown>;
  selected: number | null;
  el: HTMLElement | undefined | null;
  onClose(): void;
  onSelect?(value: any): void;
  onChangeSelect?(index: number): void;
}

export const Dropdown = (props: DropdownProps): any => {
  if (!props.el || !props.value || !props.items?.length) {
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

  return props.items?.length ? (
    <div className="custom-input__suggestions hover-box" style={style}>
      <ul>
        {props.items.map((item: CustomInputDropdown, index: number) => {
          return (
            <li
              key={index}
              onClick={() => props.onSelect?.(item.value)}
              className={`${props.selected === index ? "bold" : ""}`}
              onMouseOver={() => props.onChangeSelect?.(index)}
            >
              <div className="title">
                <p>{item.text}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  ) : null;
};
