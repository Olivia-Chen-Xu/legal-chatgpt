import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
}

const MyButton: React.FC<ButtonProps> = ({ text, onClick }) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  );
};

export default MyButton;
