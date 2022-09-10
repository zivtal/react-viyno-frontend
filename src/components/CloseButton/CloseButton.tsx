import React from "react";
import "./CloseButton.scss";
import { BG_COLOR } from "../../shared/constants/variables";

interface Props {
  if?: boolean;
  size?: number;
  onClick: () => void;
  color?: string;
  background?: string;
}

export const CloseButton = (props: Props): JSX.Element | null => {
  const size = props.size || 24;

  const lineStyle = {
    width: (size * 16) / 15 + "px",
    height: (size * 16) / 15 / 7.5 + "px",
    backgroundColor: props.color || BG_COLOR,
  };

  const iconStyle = {
    width: size + "px",
    height: size + "px",
  };

  return props.if === undefined || props.if ? (
    <div
      className="close-icon"
      style={iconStyle}
      onClick={() => props.onClick()}
    >
      <div className="close-icon__line-right" style={lineStyle}></div>
      <div className="close-icon__line-left" style={lineStyle}></div>
    </div>
  ) : null;
};
