import React from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
  size?: number;
}

export const FloatLoader = (props: Props) => {
  return props.isActive ? (
    <div className="float-loader" style={props.style}>
      <div
        style={
          props.size ? { transform: `scale(${1 * (props.size / 40)})` } : {}
        }
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : null;
};
