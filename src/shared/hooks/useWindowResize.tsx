import { useEffect } from "react";
import { useState } from "react";

interface Size {
  width: number;
  height: number;
}

const useWindowResize = (): Size => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

export default useWindowResize;
