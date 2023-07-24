import { useEffect, useRef } from "react";

export function useClickAway(cb:Function) {
    const ref = useRef(null);
    const refCb = useRef(cb);
  
    useEffect(() => {
      const handler = (e:MouseEvent | TouchEvent) => {
        const element:any = ref.current;
        if (element && !element.contains(e.target)) {
          refCb.current(e);
        }
      };
  
      document.addEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler);
  
      return () => {
        document.removeEventListener("mousedown", handler);
        document.removeEventListener("touchstart", handler);
      };
    }, []);
  
    return ref;
  }