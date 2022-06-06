import React, { useState } from "react";
import useWindowResize from "../../../../../shared/hooks/useWindowResize";
// @ts-ignore
import { minMax } from "../../../../../services/util.service";
import { WineCardPreview } from "../WinesPreview/WineCardPreview";
import { Loader } from "../../../../../components/Loader/Loader";
import { Wine } from "../../../models/wine.models";
import { WINE_DEMO } from "../../constants/wine";

interface Props {
  wines?: Array<Wine>;
  loading?: boolean;
  isFlexMode?: boolean;
  demo?: any;
  title?: string;
}

interface MousePosition {
  start?: number;
  end?: number;
}

interface TitleProps {
  title?: string;
}

const SliderTitle = (props: TitleProps) => {
  return props.title ? <h1>{props.title}</h1> : null;
};

export const WineSlider = (props: Props) => {
  const rtl = document.dir === "rtl";
  const { isFlexMode, loading } = props;
  const [position, setPosition] = useState<number>(0);
  const [touchPos, setTouchPos] = useState<MousePosition | null>(null);
  const width = useWindowResize()?.width;
  const itemPerPage = Math.min(Math.floor(width / 250), 4) || 4;

  const data: Array<Wine> = !props.loading
    ? props.wines || []
    : Array(8).fill(WINE_DEMO);

  const sliderStyle = () => {
    const sec = 2;
    const pos = position
      ? -(
          (Math.min((position + 1) * itemPerPage, data?.length || 8) /
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

  // const touchStart = (ev: any) => {
  //   if (!touchPos) setTouchPos({ start: ev.touches[0].pageX });
  // };

  const touchMove = (ev: any) => {
    if (!touchPos) setTouchPos({ start: ev.touches[0].pageX });
    else setTouchPos({ ...touchPos, end: ev.touches[0].pageX });
  };

  const touchEnd = () => {
    if (!touchPos?.start || !touchPos?.end) {
      return;
    }

    const move = Math.floor((touchPos.start - touchPos.end) / 100);
    const page = minMax(move + position, 0, (data?.length || 8) / itemPerPage);
    setPosition(page / itemPerPage);
    setTouchPos(null);
  };

  const nextEnabled = () => {
    return rtl
      ? position
      : (data?.length || 8) > position * itemPerPage + itemPerPage;
  };

  const backEnabled = () =>
    rtl ? (data?.length || 8) > position * itemPerPage + itemPerPage : position;

  return loading || data?.length ? (
    <>
      <SliderTitle title={props.title} />

      <div
        className={`wine-slider-container ${
          isFlexMode ? "flex-mode-enabled" : ""
        }`}
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

        <div className="wine-cards">
          <div className="wine-slider" style={sliderStyle()}>
            <Loader if={loading} type="overlay-skeleton">
              {data?.map((wine: Wine, index) => (
                <WineCardPreview
                  wine={wine}
                  style={{ width: `calc(${100 / itemPerPage}% - 20px)` }}
                  isMinimal={true}
                  key={index}
                />
              ))}
            </Loader>
          </div>
        </div>
      </div>
    </>
  ):null;
};
