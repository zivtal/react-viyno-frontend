import React from "react";

const useInfinityScroll = (cb: Function, deps: any, isEnabled: boolean) => {
  // (async () => {
  //   await cb();
  // })();

  const infinityScroll = async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      window.removeEventListener("scroll", infinityScroll);

      await cb();
    }
  };

  React.useEffect(() => {
    if (deps && isEnabled) {
      window.addEventListener("scroll", infinityScroll);
    }

    return () => {
      window.removeEventListener("scroll", infinityScroll);
    };
  }, deps);
};

export default useInfinityScroll;
