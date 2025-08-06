import React, { useEffect, useState } from "react";

export default function NestLogo() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const minScale = 0.6;
      const maxScroll = 200;
      const newScale = Math.max(minScale, 1 - scrollY / maxScroll);
      setScale(newScale);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center transition-all duration-300 ease-in-out"
      style={{
        transform: `scale(${scale})`,
        paddingTop: `${40 * scale}px`,
        paddingBottom: `${20 * scale}px`,
        transition: "transform 0.2s ease-out, padding 0.2s ease-out",
      }}
    >
      <img
        src="/nest.svg"
        alt="Nest Logo"
        style={{
          width: `${144 * scale}px`,
          height: `${144 * scale}px`,
          transition: "width 0.2s, height 0.2s",
        }}
      />
      <h1
        className="font-semibold -mt-3"
        style={{
          fontSize: `${24 * scale}px`,
          color: "oklch(0.645 0.246 16.439)",
          transition: "font-size 0.2s",
        }}
      >
        Nest
      </h1>
    </div>
  );
}
