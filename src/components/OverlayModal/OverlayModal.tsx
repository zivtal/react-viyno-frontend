import React from 'react';
import './OverlayModal.scss';

interface OverlayModalProps extends React.HTMLAttributes<HTMLDivElement> {
  if: boolean;
  onClose?: () => void;
}

export const OverlayModal = (props: OverlayModalProps): JSX.Element | null => {
  const slots = () => {
    if (!props.children) {
      return null;
    }

    const children = Array.isArray(props.children) ? props.children : [props.children];

    return children.map((ch: any): JSX.Element | null => {
      if (!ch.props?.slot) {
        return ch;
      }

      const className = (ch.props?.slot ? `overlay-modal__${ch.props.slot}` : '') + (ch.props?.className ? ` ${ch.props?.className}` : '');

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

    props.onClose();
  };

  return props.if ? (
    <div className="overlay-background full" onClick={() => onClose()}>
      {slots()}
    </div>
  ) : null;
};
