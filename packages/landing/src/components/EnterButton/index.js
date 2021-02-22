import React from 'react';

//styles
import * as S from './styles';

function EnterButton({ onClick }) {
  return (
    <S.Button
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={e => {
        if ((e.which === 13 || e.which === 32) && onClick) {
          onClick(e);
        }
      }}
    >
      <span>Enter</span>
    </S.Button>
  );
}

export default EnterButton;
