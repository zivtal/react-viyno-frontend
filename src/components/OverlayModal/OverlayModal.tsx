import React, { useEffect, useState } from "react";
import "./OverlayModal.scss";

interface OverlayModalProps extends React.HTMLAttributes<HTMLDivElement> {
  if: boolean;
  onClose?: Function;
}

export const OverlayModal = (props: OverlayModalProps): JSX.Element | null => {
  const [isShown, setIsShown] = useState<boolean>(false);

  useEffect(() => {
    setIsShown(props.if);
  }, [props.if]);

  useEffect(() => {
    if (isShown) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }
  }, [isShown]);

  const slots = () => {
    if (!props.children) {
      return null;
    }

    const children = Array.isArray(props.children)
      ? props.children
      : [props.children];

    return children.map((ch: any): JSX.Element | null => {
      if (!ch.props?.slot) {
        return ch;
      }

      const generateClass = (): any => {
        const retClass = ch.props?.slot
          ? `overlay-modal__${ch.props.slot}`
          : "";
      };

      const className =
        (ch.props?.slot ? `overlay-modal__${ch.props.slot}` : "") +
        (ch.props?.className ? ` ${ch.props?.className}` : "");

      return {
        ...ch,
        props: {
          ...(({ slot, ...rest }) => rest)(ch.props),
          className,
          onClick: (ev: Event) => ev.stopPropagation(),
        },
      };
    });
  };

  const onClose = (): void => {
    if (!props.onClose) {
      return;
    }

    document.body.style.overflow = "initial";
    setIsShown(false);
    props.onClose();
  };

  return isShown ? (
    <div className="overlay-background full" onClick={() => onClose()}>
      {slots()}
    </div>
  ) : null;
};
