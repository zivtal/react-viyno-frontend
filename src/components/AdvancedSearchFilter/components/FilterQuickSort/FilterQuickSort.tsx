import React, { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWinesSort } from "../../../../pages/Wine/store/action";
import { MainState } from "../../../../store/models/store.models";
import { BaseSort } from "../../../../shared/models/base-sort";

interface SortMenuProps {
  el: HTMLButtonElement;
  isActive: boolean;
  onClose: Function;
}

export const FilterQuickSort = () => {
  const dispatch = useDispatch();
  const elButton = useRef<HTMLButtonElement>(null);
  const [isActive, setIsActive] = useState(false);
  const sort = useSelector((state: MainState) => state.wineModule.sort);

  const SortMenu = (props: SortMenuProps) => {
    const top = props.el?.offsetTop + props.el?.clientHeight + 16;
    const width = Math.max(props.el?.clientWidth || 0, 150);
    const right =
      window.innerWidth - (props.el?.offsetLeft + props.el?.clientWidth);
    const height = document.documentElement.scrollHeight;
    const options = [
      { title: "rate" },
      { title: "popular", key: "ratings" },
      { title: "recent", key: "_id" },
    ];

    const position = (type: string): JSX.Element | null => {
      const index =
        Object.keys(sort).findIndex((val: string) => val === type) + 1;
      return index ? <span>{index}</span> : null;
    };

    const style = (type: string) => {
      switch (sort[type]) {
        case 0:
          return "down";
        case 1:
          return "up";
        default:
          return "";
      }
    };
    return isActive ? (
      <div
        className="background-dimm"
        style={{ height: height + "px" }}
        onClick={() => props.onClose?.()}
      >
        <div
          onClick={(ev) => ev.stopPropagation()}
          className="quick-sort hover-box"
          style={{ top: `${top}px`, right: `${right}px`, width: `${width}px` }}
        >
          {options.map(({ title, key }, idx) => (
            <button
              key={idx}
              onClick={() => toggleSelect(key || title)}
              className={style(key || title)}
            >
              {title || key}
              {position(key || title)}
            </button>
          ))}
        </div>
      </div>
    ) : null;
  };

  const isSorted = () => sort && Object.keys(sort).length;

  const toggleSelect = (type: string) => {
    const sorting = sort[type];

    if (sorting == null) {
      dispatch(setWinesSort({ ...sort, [type]: 0 }));
      return;
    }
    if (sorting == 0) {
      dispatch(setWinesSort({ ...sort, [type]: 1 }));
      return;
    }

    const reSort = sort;
    delete reSort[type];
    dispatch(setWinesSort(reSort));
  };

  return (
    <>
      <button
        ref={elButton}
        onClick={() => setIsActive(!isActive)}
        className={`sort-button bgi ${isActive || isSorted() ? "marked" : ""}`}
        style={isActive ? { zIndex: 100 } : {}}
      >
        sort
      </button>
      <SortMenu
        isActive={isActive}
        el={elButton.current as HTMLButtonElement}
        onClose={() => setIsActive(false)}
      />
    </>
  );
};
