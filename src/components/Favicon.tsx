import React, { useEffect } from "react";

const Favicon: React.FC = () => {
  const LOGO_URL = import.meta.env.VITE_LOGO_URL || "/logo.svg";

  useEffect(() => {
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.href = LOGO_URL;
    document.head.appendChild(icon);

    return () => {
      document.head.removeChild(icon);
    };
  }, []);

  return null;
};

export default Favicon;
