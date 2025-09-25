import * as React from 'react';
import './Balloons.css';

function random(num: number) {
  return Math.floor(Math.random() * num);
}

function getRandomStyles() {
  const r = random(255);
  const g = random(255);
  const b = random(255);
  const mt = random(200);
  const ml = random(50);
  const dur = random(5) + 5;
  return `
  background-color: rgba(${r},${g},${b},0.7);
  color: rgba(${r},${g},${b},0.7); 
  box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
  margin: ${mt}px 0 0 ${ml}px;
  animation: float ${dur}s ease-in infinite
  `;
}

type BalloonProps = {
  showBallons: boolean
  callback: () => void
}

export const Balloons: React.FC<BalloonProps> = ({
  showBallons,
  callback,
}) => {
  const balloonRef = React.useRef<HTMLDivElement>(null);

  const createBalloons = React.useCallback(() => {
    if (!balloonRef.current) return;
    for (let i = 30; i > 0; i--) {
      const balloon = document.createElement("div");
      balloon.className = "balloon";
      balloon.style.cssText = getRandomStyles();
      balloonRef.current.append(balloon);
    }
  }, []);

  React.useEffect(() => {
    if (showBallons) createBalloons();
  }, [showBallons])

  const removeBalloons = React.useCallback(() => {
    if (!balloonRef.current) return;
    balloonRef.current!.style.opacity = "0";
    setTimeout(() => {
      balloonRef.current!.remove()
      callback();
    }, 500)
  }, [callback])

  return <div id="balloon-container" ref={balloonRef} onClick={removeBalloons} className="absolute top-0 left-0"></div>
}
