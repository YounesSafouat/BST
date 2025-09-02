import React from 'react';
import styled from 'styled-components';

interface ReversedButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  width?: string;
  height?: string;
  fontSize?: string;
  icon?: React.ReactNode;
}

const ReversedButton: React.FC<ReversedButtonProps> = ({
  text,
  onClick,
  className = '',
  type = 'button',
  width = '80px',
  height = '40px',
  fontSize = 'var(--font-size)',
  icon
}) => {
  return (
    <StyledWrapper className={className}>
      <div>
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter width="3000%" x="-1000%" height="3000%" y="-1000%" id="unopaq">
            <feColorMatrix values="1 0 0 0 0 
            0 1 0 0 0 
            0 0 1 0 0 
            0 0 0 3 0" />
          </filter>
        </svg>
        <div className="backdrop" />
        <button
          className="button"
          onClick={onClick}
          type={type}
          style={{ width, height, fontSize }}
          aria-label={text || 'Bouton'}
        >
          <div className="a l" />
          <div className="a r" />
          <div className="a t" />
          <div className="a b" />
          {icon && <div className="icon">{icon}</div>}
          <div className="text">{text}</div>
        </button>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    position: relative;
    cursor: pointer;
    border: none;
    background: #fff;
    color: #000;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .text {
    position: relative;
    z-index: 1;
  }

  .icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .button::before {
    content: "";
    position: absolute;
    inset: 0;
    opacity: 0;
    background: radial-gradient(
        circle at 50% 50%,
        #0000 0,
        #0000 20%,
        #ffffffaa 50%
      ),
      radial-gradient(ellipse 100% 100%, #000, #0000);
    background-size:
      3px 3px,
      auto auto;
    transition: 0.3s;
  }

  .button:hover::before {
    opacity: 0.3;
  }

  .a {
    pointer-events: none;
    position: absolute;
    --w: 2px;
    --t: -40px;
    --s: calc(var(--t) * -1);
    --e: calc(100% + var(--t));
    --g: #0000, #0003 var(--s), #000a var(--s), #000, #000a var(--e),
      #0003 var(--e), #0000;
  }

  .a::before {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(4px) url(#unopaq);
    z-index: -2;
  }

  .a::after {
    content: "";
    position: absolute;
    inset: 0;
    background: inherit;
    filter: blur(10px) url(#unopaq);
    opacity: 0;
    z-index: -2;
    transition: 0.3s;
  }

  .button:hover .a::after {
    opacity: 1;
  }

  .l {
    left: -2px;
  }

  .r {
    right: -2px;
  }

  .l,
  .r {
    background: linear-gradient(var(--g));
    top: var(--t);
    bottom: var(--t);
    width: var(--w);
  }

  .t {
    top: -2px;
  }

  .b {
    bottom: -2px;
  }

  .t,
  .b {
    background: linear-gradient(90deg, var(--g));
    left: var(--t);
    right: var(--t);
    height: var(--w);
  }

  .backdrop {
    position: absolute;
    inset: -9900%;
    background: radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 20%,
      #ffffffaa 50%
    );
    background-size: 3px 3px;
    z-index: -1;
  }`;

export default ReversedButton; 