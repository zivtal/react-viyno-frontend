import React from "react";
import "./PaginationControl.scss";
import { Icon } from "../Icon/Icon";
import { CustomButton } from "../CustomButton/CustomButton";

interface PaginationProps {
  total: number;
  current: number;
  maxPagesToShow?: number;
  onPageSelect: Function;
}

export const PaginationControl = (props: PaginationProps) => {
  const maxShown = props.maxPagesToShow || 10;

  // const pageControl = () => Array().fill();

  return (
    <div className="pagination-control">
      <Icon name="prev" size={10} />
      <CustomButton label="1" />
      <CustomButton label="2" />
      <CustomButton label="3" />
      <CustomButton label="4" />
      <CustomButton label="5" />
      <CustomButton label="6" />
      <CustomButton label="7" />
      <CustomButton label="8" />
      <CustomButton label="9" />
      <CustomButton label="10" />
      <Icon name="next" size={10} />
    </div>
  );
};
