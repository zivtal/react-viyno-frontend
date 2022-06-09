import React from "react";

const useInfinityScroll = (
  cb: Function,
  deps: any,
  isEnabled: boolean,
  className: string
) => {
  // (async () => {
  //   await cb();
  // })();

  const infinityScroll = async () => {
    const element = document.querySelector(className || ".App > .content");
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      element?.removeEventListener("scroll", infinityScroll);

      await cb();
    }
  };

  React.useEffect(() => {
    const element = document.querySelector(className || ".App > .content");
    if (deps && isEnabled) {
      element?.addEventListener("scroll", infinityScroll);
    }

    return () => {
      element?.removeEventListener("scroll", infinityScroll);
    };
  }, deps);
};

export default useInfinityScroll;
