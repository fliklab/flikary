import React, { useEffect, useRef, useState } from "react";

interface LiquidSpotProps {
  color?: string; // 기본: gradient와 어울리는 연한 초록/분홍
  size?: number; // px, 기본 120
  opacity?: number; // 0~1, 기본 0.35
  fadeDuration?: number; // ms, 기본 350
  expandOnClick?: boolean; // 클릭 시 확장 효과
  style?: React.CSSProperties;
  hoverActive?: boolean; // 메뉴 hover 시 true
  fading?: boolean;
  onFadeEnd?: () => void;
}

const DEFAULT_COLOR = "rgba(173,255,168,0.7)"; // 연한 초록
const DEFAULT_SIZE = 120;
const DEFAULT_OPACITY = 0.35;
const DEFAULT_FADE = 350;

const LiquidSpot: React.FC<LiquidSpotProps> = ({
  color = DEFAULT_COLOR,
  size = DEFAULT_SIZE,
  opacity = DEFAULT_OPACITY,
  fadeDuration = DEFAULT_FADE,
  expandOnClick = true,
  style = {},
  hoverActive = false,
  fading = false,
  onFadeEnd,
}) => {
  const [visible, setVisible] = useState(false);
  const [target, setTarget] = useState({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [expanding, setExpanding] = useState(false);
  const spotRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>();

  // friction 값: hoverActive면 빠르게, 아니면 느리게
  const friction = hoverActive ? 0.32 : 0.12;

  // 마우스 따라다니기 (관성)
  useEffect(() => {
    if (!visible && !fading && !expanding) return;
    let running = true;
    function animate() {
      setPos(prev => {
        const dx = target.x - prev.x;
        const dy = target.y - prev.y;
        return {
          x: prev.x + dx * friction,
          y: prev.y + dy * friction,
        };
      });
      if (running) animRef.current = requestAnimationFrame(animate);
    }
    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [target, visible, fading, expanding, friction]);

  // 마우스 이동 이벤트
  useEffect(() => {
    function move(e: MouseEvent) {
      setTarget({ x: e.clientX, y: e.clientY });
      setVisible(true);
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // fade out 중에도 마우스 따라감
  useEffect(() => {
    if (!fading) return;
    function move(e: MouseEvent) {
      setTarget({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [fading]);

  // fade out 끝나면 onFadeEnd 콜백 호출
  useEffect(() => {
    if (!fading) return;
    const timer = setTimeout(() => {
      setVisible(false);
      if (onFadeEnd) onFadeEnd();
    }, fadeDuration);
    return () => clearTimeout(timer);
  }, [fading, fadeDuration, onFadeEnd]);

  // 클릭 시 확장 효과
  useEffect(() => {
    if (!expandOnClick) return;
    function handleClick() {
      setExpanding(true);
      setTimeout(() => {
        if (onFadeEnd) onFadeEnd();
      }, 220);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [expandOnClick, onFadeEnd]);

  if (!visible && !fading && !expanding) return null;

  // 스타일 계산
  const spotStyle: React.CSSProperties = {
    position: "fixed",
    left: pos.x - size / 2,
    top: pos.y - size / 2,
    width: size,
    height: size,
    pointerEvents: "none",
    borderRadius: "50%",
    background: `radial-gradient(circle at 50% 50%, ${color} 60%, transparent 100%)`,
    opacity: fading ? 0 : opacity,
    filter: "blur(18px) saturate(1.2)",
    boxShadow: `0 0 60px 10px ${color}`,
    transition: `
      opacity ${fadeDuration}ms cubic-bezier(.4,1.6,.6,1),
      width 0.32s cubic-bezier(.4,1.6,.6,1),
      height 0.32s cubic-bezier(.4,1.6,.6,1)
    `,
    zIndex: 10,
    ...style,
  };
  if (expanding) {
    spotStyle.width = size * 2.2;
    spotStyle.height = size * 2.2;
    spotStyle.left = pos.x - (size * 2.2) / 2;
    spotStyle.top = pos.y - (size * 2.2) / 2;
    spotStyle.opacity = 0;
    spotStyle.filter = "blur(32px) saturate(1.2)";
  }

  return <div ref={spotRef} style={spotStyle} />;
};

export default LiquidSpot;
