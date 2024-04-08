import React from "react";
import styled, { css } from "styled-components";

// ========== 스타일 정의 START ===========
//컬러변수
export const colors = {
  whiteFFF: "#FFFFFF",
  whiteF9F9F9: "#F9F9F9",
  grayD2D2D2: "#D2D2D2",
  grayEEE: "#EEEEEE",
  blue0F5BC9: "#0F5BC9",
  primaryBlue: "#0B68EE",
  black222: "#222222",
  grayAAA: "#AAAAAA",
  grayF7F7F7: "#F7F7F7",
  green: "rgb(69,123,59)",
};

//버튼 disabled 스타일
const disableColor = css`
  background: ${colors.whiteF9F9F9};
  color: ${colors.grayD2D2D2};
  border-color: ${colors.grayEEE};

  &:hover {
    background: ${colors.whiteF9F9F9};
    color: ${colors.grayD2D2D2};
    border-color: ${colors.grayEEE};
  }
`;

//버튼 사이즈 스타일
const sizeStyles = {
  60: css`
    height: 60px;
    border-radius: 8px;
    font-size: 18px;
    padding: 0 23px;
  `,
  48: css`
    height: 48px;
    border-radius: 6px;
    font-size: 16px;
    padding: 0 20px;
  `,
};

//버튼 color 스타일
const colorStyles = {
  blue: css`
    background: ${colors.primaryBlue};
    color: ${colors.whiteFFF};

    &:hover {
      background: ${colors.blue0F5BC9};
    }
  `,
  lightGray: css`
    background: ${colors.whiteFFF};
    color: ${colors.black222};
    border-color: ${colors.grayAAA};

    &:hover {
      border-color: ${colors.black222};
    }
  `,
};

//테두리 스타일
const borderStyles = {
  solid: css`
    border: none;
  `,
  outline: css`
    border: 1px solid;
  `,
};

// ========== 스타일 정의 END ===========

const ButtonWrap = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-weight: 600;

  ${({ height }) => sizeStyles[height]}

  width: ${({ width }) => width};

  ${({ color }) => colorStyles[color]}

  ${({ border }) => borderStyles[border]}

  &:disabled {
    ${disableColor}
  }
`;

const Button = (props) => {
  const {
    border = "solid", // 버튼 테두리, 아이콘 여부 결정 | solid, outline, textWithIcon
    height = "60", // 크기, 폰트 사이즈 결정 || 60, 48, 40, 32, 28
    width = "100%",
    buttonColor = "blue", // 배경색, 테두리 색상, hover 속성 결정 || blue, black, gray, lightGray, darkGray, white
    disabled = false,
    onClick,
    children,
    buttonType = "button",
    // onClose,
  } = props;

  return (
    <ButtonWrap
      type={buttonType}
      border={border}
      height={height}
      width={width}
      color={buttonColor}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </ButtonWrap>
  );
};

export default Button;
