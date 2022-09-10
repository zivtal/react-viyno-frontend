import React, { useState } from "react";
// @ts-ignore
import emptyStar from "../../assets/imgs/icons/empty-star.svg";
// @ts-ignore
import fullStar from "../../assets/imgs/icons/full-star.svg";

interface Props {
  rate: number | null;
  total?: number;
  size?: number;
  editable?: boolean;
  onSet?: (rate: number | null) => void;
}

export function StarRate({
  rate,
  total = 5,
  size = 16,
  editable = false,
  onSet,
}: Props) {
  const rtl = document.dir === "rtl";
  const box = total * size;

  const [prevRate, setPrevRate] = useState<number>(rate || total);
  const [tempRate, setTempRate] = useState<number | null>(null);

  const style = editable ? { cursor: "pointer" } : {};
  const styleStar = { width: size + "px", height: size + "px" };
  const styleEmptyStar = { width: box + "px", ...style };
  const styleFullStar = {
    width: box,
    clipPath: `inset(0 ${box - box * ((tempRate || prevRate) / total)}px 0 0)`,
    // width: box * ((tempRate || prevRate) / total) + "px",
    // marginInlineStart: box * ((tempRate || prevRate) / total) - box + "px",
    ...style,
  };

  const hover = (ev: any, isTouch?: boolean): void => {
    if (!editable) {
      return;
    }

    const x = isTouch ? ev.touches[0].clientX : ev.pageX;
    const { left, right, width } =
      ev.target.parentElement.getBoundingClientRect();
    const position = Math.min(rtl ? width - (right - x) : x - left, box);
    setTempRate(Math.max(Math.round(position / (size / 2) + 0.5) / 2, 1));
  };

  const click = (): void => {
    if (!editable || !tempRate) {
      return;
    }

    setPrevRate(tempRate);
    onSet?.(tempRate);
  };

  return (
    <div
      className="stars-container"
      onClick={click}
      onBlur={() => setTempRate(null)}
      onMouseLeave={() => setTempRate(null)}
    >
      <div
        className="stars"
        style={styleEmptyStar}
        onMouseMove={hover}
        onTouchMove={(ev) => hover(ev, true)}
      >
        {[...Array(total)].map((_, index) => (
          <img style={styleStar} src={emptyStar} key={"EMPTY_STAR_" + index} />
        ))}
      </div>
      <div
        className="stars"
        style={styleFullStar}
        onMouseMove={hover}
        onTouchMove={(ev) => hover(ev, true)}
      >
        {[...Array(total)].map((_, index) => (
          <img style={styleStar} src={fullStar} key={"FULL_STAR_" + index} />
        ))}
      </div>
    </div>
  );
}
