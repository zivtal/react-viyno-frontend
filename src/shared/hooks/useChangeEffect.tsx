import React from "react";

const useChangeEffect = (cb: Function, deps: Array<any>) => {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    if (isMounted.current) {
      cb();
    }
  }, deps);

  React.useEffect(() => {
    isMounted.current = true;
  }, []);
};

export default useChangeEffect;
