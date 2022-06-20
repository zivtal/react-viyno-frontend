import React, { ImgHTMLAttributes } from "react";
import { tryRequire } from "../../services/require.service";
import "./CustomButton.scss";
import { Loader } from "../Loader/Loader";

interface IconProps {
  label?: string | number;
  iconName?: string;
  iconSize?: number;
  onClick?: Function;
  loading?: boolean;
  minWidth?: number;
  children?: Array<JSX.Element | string> | JSX.Element | string;
}

export const CustomButton = (props: IconProps) => {
  const style: any = {};
  const iconSize = (props?.iconSize || 14) + "px";

  if (props.minWidth) {
    style.minWidth = props?.minWidth + "px";
  }

  const onClick = (ev: any) => {
    ev.stopPropagation();

    props.onClick?.();
  };

  const button = (
    <label className="custom-button__content" onClick={(ev) => onClick(ev)}>
      {props.iconName ? (
        <img
          src={tryRequire("imgs/icons/" + props.iconName + ".svg")}
          height={iconSize}
          width={iconSize}
        />
      ) : null}
      {props.label !== undefined ? <span>{props.label}</span> : null}
      {props.children}
    </label>
  );

  const loading = (
    <div className="custom-button__loader">
      <Loader type="spinner-1" size={props.iconSize || 14} />
    </div>
  );

  return (
    <div className="custom-button" style={style}>
      {props.loading ? loading : button}
    </div>
  );
};
