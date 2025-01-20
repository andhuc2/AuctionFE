import React, { useEffect } from "react";
import { Constant } from "../utils/Constant";

const Favicon: React.FC = () => {
  useEffect(() => {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = Constant.ASSET.LOGO_URL;
    document.head.appendChild(icon);

    return () => {
      document.head.removeChild(icon);
    };
  }, []);

  return null;
};

export default Favicon;
