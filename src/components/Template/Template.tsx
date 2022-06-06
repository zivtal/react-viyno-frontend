import React from "react";

const element = (parent: any): (JSX.Element | null)[] => {
  let vIndex: number | null = null;

  return (Array.isArray(parent) ? parent : [parent]).map(
    (el: any, index: number): JSX.Element | null => {
      if (
        el?.props?.vif === undefined &&
        el?.props?.velse === undefined &&
        el?.props?.velseif === undefined
      ) {
        return el;
      }

      const checkPrevCondition = (): boolean => {
        return parent
          .slice(vIndex, index)
          .some((el: any) => el.props?.vif || el.props?.velseif);
      };

      if (el?.props?.vif !== undefined) {
        vIndex = index;

        if (!el?.props?.vif) {
          return null;
        }
      }

      if (el?.props?.velse !== undefined && checkPrevCondition()) {
        return null;
      }

      if (
        el?.props?.velseif !== undefined &&
        (!el?.props?.velseif || checkPrevCondition())
      ) {
        return null;
      }

      vIndex = null;

      return {
        ...el,
        props: {
          ...(({ vif, velse, velseif, ...rest }) => rest)(el.props),
          children: element(el.props.children) || el.props.children,
        },
      };
    }
  );
};

export const Template = (props: any): JSX.Element | null => {
  return props.children ? <>{element(props.children)}</> : null;
};
