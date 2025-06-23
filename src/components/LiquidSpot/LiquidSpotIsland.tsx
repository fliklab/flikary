import React, { useRef, useState } from "react";
import LiquidSpot from "./LiquidSpot";

interface LiquidSpotIslandProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
  opacity?: number;
  fadeDuration?: number;
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

const LiquidSpotIsland: React.FC<LiquidSpotIslandProps> = ({
  children,
  color = "rgba(173,255,168,0.5)",
  size = 90,
  opacity = 0.18,
  fadeDuration = 1500,
  id,
  className,
  style,
}) => {
  const [show, setShow] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [fading, setFading] = useState(false);
  const ref = useRef<HTMLUListElement>(null);

  function handleMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ x: e.clientX, y: e.clientY });
    if (!show) setShow(true);
    if (fading) setFading(false);
  }
  function handleLeave() {
    setFading(true);
    setClicked(false);
  }
  function handleClick() {
    setClicked(true);
    setTimeout(() => setFading(true), 400);
  }
  function handleFadeEnd() {
    setShow(false);
    setFading(false);
    setClicked(false);
  }

  return (
    <ul
      ref={ref}
      id={id}
      className={className}
      style={{ position: "relative", zIndex: 20, ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={handleClick}
    >
      {children}
      {(show || fading) && (
        <LiquidSpot
          color={color}
          size={size}
          opacity={opacity}
          fadeDuration={fadeDuration}
          expandOnClick={clicked}
          style={{
            left: coords.x - size / 2,
            top: coords.y - size / 2,
            position: "fixed",
          }}
          fading={fading}
          onFadeEnd={handleFadeEnd}
        />
      )}
    </ul>
  );
};

export default LiquidSpotIsland;
