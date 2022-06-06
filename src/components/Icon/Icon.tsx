import React, { ImgHTMLAttributes } from "react";
import { tryRequire } from "../../services/require.service";
import "./Icon.scss";

interface IconProps {
  name: string;
  size?: number;
  notClickable?: boolean;
  style?: any;
  className?: any;
  onClick?: Function;
}

export const Icon = (props: IconProps) => {
  const size = (props?.size || 24) + "px";

  return (
    <div className="icon">
      <img
        onClick={() => props.onClick?.()}
        style={props.style}
        className={props.className}
        src={tryRequire("imgs/icons/" + props.name + ".svg")}
        height={size}
        width={size}
      />
    </div>
  );
};
