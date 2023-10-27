import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';

export const Nav = styled.nav`
  background:#404a86;
  height: 60px;
  display: flex;
  justify-content: flex-start;
 /* padding: 0.5rem calc((100vw - 1000px) / 2);*/
  padding-top:5px;
  z-index: 10;

  /* Third Nav */
  /* justify-content: flex-start; */
`;

export const NavLink = styled(Link)`
  color: #fff;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  height: 100%;
  cursor: pointer;

  &.active {
    color: #15cdfc;
  }
`;

export const NavLinkage = styled(Link)`
  color: #fff;
  text-decoration: none;
  padding: 0 0.3rem;
  height: 100%;
  cursor: pointer;
  padding-left: 0px;

  &.active {
    color: #15cdfc;
  }
`;


export const NavMenu = styled.div`
  display: flex;
  align-items: center;
  margin-right: -154px;

  /* Second Nav */
  /* margin-right: 24px; */

  /* Third Nav */
  /* width: 100vw;
  white-space: nowrap; */

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
