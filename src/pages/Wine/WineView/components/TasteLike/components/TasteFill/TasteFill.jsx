import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom/cjs/react-router-dom.min";
import useWindowResize from "../../../../../../../shared/hooks/useWindowResize";
import {
  getShortSentence,
  minMax,
} from "../../../../../../../services/util.service";
import { tryRequire } from "../../../../../../../services/require.service";
import { toKebabCase } from "../../../../../../../services/dev.service";

function getDescription(mentions) {
  const desc = mentions.map((taste) => taste.keyword).join(", ");
  return getShortSentence(desc);
}

export function TasteFill(props) {
  const location = useLocation();
  const history = useHistory();
  const { tastes } = props;
  const [position, setPosition] = useState(0);
  const [touchPos, setTouchPos] = useState(null);
  const rtl = document.dir === "rtl";
  const width = useWindowResize()?.width;

  if (!tastes || !tastes.length) {
    return null;
  }

  const itemPerPage = minMax(Math.floor(width / 280), 1, 3);

  const setQuery = (name, value) => {
    const queryParams = new URLSearchParams(location.search);
    if (value) queryParams.set(name, value);
    else queryParams.delete(name);
    history.replace({ search: queryParams.toString() });
  };

  const display = () => {
    return tastes.map((taste, idx) => {
      const url = tryRequire(`imgs/icons/taste/${toKebabCase(taste.name)}.svg`);
      return (
        <div
          className="taste-fill-preview hover-box"
          key={"TASTE_FILL_" + idx}
          onClick={() => props.onClick?.(taste.name)}
          style={{ width: `calc(${100 / itemPerPage}% - 8px)` }}
        >
          <div className="picture" style={{ backgroundColor: taste.color }}>
            <img src={url} alt={taste.name} />
          </div>
          <h3>{getDescription(taste.mentions)}</h3>
          <p>
            {taste.total} mentions of{" "}
            <span style={{ color: taste.color }}>{taste.name}</span> notes
          </p>
        </div>
      );
    });
  };

  const sliderStyle = () => {
    const sec = 2;
    const pos = position
      ? -(
          (Math.min((position + 1) * itemPerPage, tastes.length) /
            itemPerPage) *
            100 -
          100
        )
      : 0;
    return {
      transform: `translateX(${rtl ? -pos : pos}%)`,
      transition: `${-pos % 100 ? sec / (100 / (-pos % 100)) : sec}s`,
    };
  };

  // const touchStart = (ev) => {
  //   setTouchPos({ start: ev.touches[0].pageX });
  // };

  const touchMove = (ev) => {
    if (!touchPos) setTouchPos({ start: ev.touches[0].pageX });
    else setTouchPos({ ...touchPos, end: ev.touches[0].pageX });
  };

  const touchEnd = () => {
    const move = Math.floor((touchPos.start - touchPos.end) / 100);
    const page = minMax(move + position, 0, tastes.length / itemPerPage);
    setPosition(page / itemPerPage);
    setTouchPos(null);
  };

  const nextEnabled = () =>
    rtl ? position : tastes.length > position * itemPerPage + itemPerPage;
  const backEnabled = () =>
    rtl ? tastes.length > position * itemPerPage + itemPerPage : position;

  return (
    <div
      className="taste-fill"
      // onTouchStart={touchStart}
      onTouchMove={touchMove}
      onTouchEnd={touchEnd}
    >
      {nextEnabled() ? (
        <button
          className="next"
          onClick={() => setPosition(rtl ? position - 1 : position + 1)}
        ></button>
      ) : null}
      {backEnabled() ? (
        <button
          className="back"
          onClick={() => setPosition(rtl ? position + 1 : position - 1)}
        ></button>
      ) : null}
      <div className="taste-cards">
        <div className="taste-slider" style={sliderStyle()}>
          {display()}
        </div>
      </div>
    </div>
  );
}
