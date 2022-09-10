import React from "react";
import { tryRequire } from "../../shared/helpers/require";
import "./Icon.scss";

interface IconProps {
  name: string;
  size?: number;
  notClickable?: boolean;
  style?: any;
  className?: any;
  onClick?: () => void;
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
