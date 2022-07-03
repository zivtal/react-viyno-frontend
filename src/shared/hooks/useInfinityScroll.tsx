import React from "react";

const useInfinityScroll = (
  cb: Function,
  deps: any,
  isEnabled: boolean,
  className?: string
) => {
  // const element = document.querySelector(
  //   className || ".App > .content"
  // ) as HTMLDivElement;
  //
  // if (element) {
  //   while (element.scrollHeight < element.clientHeight * 1.2) {
  //     (async () => {
  //       await cb();
  //     })();
  //   }
  // }

  const infinityScroll = async () => {
    const element = document.querySelector(
      className || ".App > .content"
    ) as HTMLDivElement;
    const { scrollTop, clientHeight, scrollHeight } = element;

    if (scrollTop + clientHeight >= scrollHeight * 0.8) {
      element?.removeEventListener("scroll", infinityScroll);

      await cb();
    }
  };

  React.useEffect(() => {
    const element = document.querySelector(
      className || ".App > .content"
    ) as HTMLDivElement;

    if (deps && isEnabled) {
      element?.addEventListener("scroll", infinityScroll);
    }

    return () => {
      element?.removeEventListener("scroll", infinityScroll);
    };
  }, deps);
};

export default useInfinityScroll;
