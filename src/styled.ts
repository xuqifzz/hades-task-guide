import styled from "styled-components";
import { Github } from "styled-icons/fa-brands/Github";

export const ForkButton = styled.a`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  width: 130px;
  height: 130px;
  background: #09f;
  transform: rotate(45deg) translateY(-70%);
  box-shadow: rgba(0, 0, 0, 0.15) 0 2px 5px;
  display: flex;
  justify-content: center;
  padding: 8px;

  ${Github} {
    height: 36px;
    color: #fff;
    align-self: flex-end;
  }
`;