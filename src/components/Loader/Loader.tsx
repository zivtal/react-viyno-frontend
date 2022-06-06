import React from "react";

import "./Loader.scss";
import {
  BASE_SIZE,
  BG_COLOR,
  BRAND_COLOR,
  LITE_COLOR,
} from "../../shared/constants/variables";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  if?: boolean;
  demo?: any;
  speed?: number;
  type?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  // className?: string;
  // style?: CSS.Properties;
  // children?: string | string[] | JSX.Element | JSX.Element[];
}

interface LoaderType {
  name: string;
  template: Function;
  demo?: any;
}

export const Loader = (props: Props): any => {
  if (props.if !== undefined && !props.if) {
    return props?.children || null;
  }

  const loaders: Array<LoaderType> = [
    {
      name: "float-1",
      template: () => {
        const size = props.size || BASE_SIZE;
        const mainStyle = {
          height: `${size}px`,
          width: `${size * 2}px`,
        };

        const dotStyle = {
          height: `${size * 0.3}px`,
          width: `${size * 0.3}px`,
          background: props.color || BRAND_COLOR,
          top: `${size / 2 - size * 0.2}px`,
        };

        return (
          <div
            className={`loaders__float-1${
              props.className ? ` ${props.className}` : ""
            }`}
            style={mainStyle}
          >
            <div style={{ ...dotStyle, left: `${size * 0.2}px` }}></div>
            <div style={{ ...dotStyle, left: `${size * 0.35}px` }}></div>
            <div style={{ ...dotStyle, left: `${size * 0.8}px` }}></div>
            <div style={{ ...dotStyle, left: `${size * 1.4}px` }}></div>
          </div>
        );
      },
    },
    {
      name: "spinner-1",
      template: () => {
        const style = {
          width: `${props.size || BASE_SIZE}px`,
          height: `${props.size || BASE_SIZE}px`,
          border: `${(props.size || BASE_SIZE) / 10}px solid ${LITE_COLOR}`,
          borderBottomColor: props.color || BRAND_COLOR,
        };

        return (
          <span
            className={`loaders__spinner-1${
              props.className ? ` ${props.className}` : ""
            }`}
            style={style}
          ></span>
        );
      },
    },
    {
      name: "spinner-2",
      template: () => {
        const style = {
          width: `${props.size || BASE_SIZE}px`,
          height: `${props.size || BASE_SIZE}px`,
          border: `${(props.size || BASE_SIZE) / 10}px solid`,
          borderColor: `${BRAND_COLOR} transparent`,
        };

        return (
          <span
            className={`loaders__spinner-2${
              props.className ? ` ${props.className}` : ""
            }`}
            style={style}
          ></span>
        );
      },
    },
    {
      name: "overlay-skeleton",
      template: () => {
        const children = (child: any) =>
          (Array.isArray(child) ? child : [child]).map((el: any) => {
            if (typeof el === "string" || typeof el.type === "string") {
              return el;
            }

            const demo = el.props.demo ? el.props.demo : props.demo || {};
            const loading =
              el.props.loading !== undefined ? el.props.loading : props.if;

            return {
              ...el,
              props: {
                ...el.props,
                loading,
                demo,
                // style,
              },
            };
          });

        return (
          <div className={`loaders__overlay-skeleton`} style={props.style}>
            {children(props.children)}
          </div>
        );
      },
    },
    {
      name: "wine-card",
      template: () => {
        const size = Math.max(props.size || BASE_SIZE, 230);

        const style = {
          width: `${size}px`,
          background: props.color || BG_COLOR,
        };
        return (
          <div
            className={`loaders__wine-card hover-box${
              props.className ? ` ${props.className}` : ""
            }`}
            style={{ ...style, ...props.style }}
          >
            <div>
              <svg width="160px" height="320px" viewBox="0 0 640 1280">
                <g
                  transform="translate(-80,1260) scale(0.102,-0.1)"
                  fill="#bbb"
                  stroke="none"
                >
                  <path d="M3050 12609 c-217 -12 -268 -22 -304 -59 -29 -29 -31 -35 -34 -123 -3 -71 -8 -97 -22 -112 -14 -16 -19 -47 -24 -171 -7 -144 -6 -153 15 -189 25 -42 25 -23 -6 -1040 -8 -258 -15 -550 -15 -647 0 -212 -16 -457 -36 -553 -26 -131 -59 -180 -250 -376 -267 -274 -398 -468 -492 -729 -81 -226 -100 -332 -112 -630 -30 -748 -40 -6839 -12 -6873 6 -7 24 -55 41 -107 56 -174 86 -203 241 -239 221 -52 544 -71 1235 -71 872 0 1156 35 1299 161 27 23 41 50 65 122 40 123 49 181 60 387 6 100 11 1607 12 3495 3 3467 5 3343 -37 3525 -45 197 -150 428 -284 630 -68 102 -115 157 -253 295 -171 172 -203 213 -238 306 -51 133 -66 281 -79 759 -9 326 -30 1006 -44 1402 -4 121 -3 130 20 173 22 42 24 57 24 184 0 131 -1 139 -25 171 -22 30 -25 44 -25 116 0 49 -6 96 -15 117 -14 33 -19 36 -87 52 -137 31 -348 39 -618 24z" />
                </g>
              </svg>
            </div>

            <div></div>
          </div>
        );
      },
    },
    {
      name: "skeleton-5",
      template: () => {
        const style = {
          width: `${props.size || BASE_SIZE}px`,
          height: `${(props.size || BASE_SIZE) * 0.46875}px`,
          background: props.backgroundColor || BG_COLOR,
        };

        return (
          <span
            className={`loaders__skeleton-5${
              props.className ? ` ${props.className}` : ""
            }`}
            style={style}
          ></span>
        );
      },
    },
  ];

  const loader =
    loaders.find((loader) => loader.name === props.type) || loaders[0];

  return loader?.template() || null;
};
