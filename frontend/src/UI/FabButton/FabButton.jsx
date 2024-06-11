import React, { useState } from 'react';
import BoardCardList from './FloatingBoardCard';
import style from './FabButton.module.css';
import { useSpring, animated } from '@react-spring/web';

const FabButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const MoveToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const menuAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 170, friction: 16 },
  });

  return (
    <div className={style.container}>
      {isOpen && (
        <animated.div style={menuAnimation} className={style.menu}>
          <BoardCardList />
        </animated.div>
      )}
      <div className={style.button}>
        <button onClick={MoveToTop} 
        className={style.moveButton}>&#9652;</button>
        <button className={style.fab} onClick={toggleMenu}>+</button>
      </div>
    </div>
  );
};

export default FabButton;
