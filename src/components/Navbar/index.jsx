import React from 'react';
import {
  Nav,
  NavLink,
  NavMenu,
  NavLinkage
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>

      <NavLinkage to='/mcap' >
          <img src={require('../../images/logos/Marshall Islands.svg.png')} alt='logo' style={{width:"50px", height:"50px",marginTop:"0px"}}/>
        </NavLinkage>
        <NavLinkage to='/mcap' >
          <img src={require('../../images/logos/Palau.png')} alt='logo' style={{width:"50px", height:"50px",marginTop:"0px"}}/>
        </NavLinkage>
        <NavLinkage to='/mcap' >
          <img src={require('../../images/logos/Tuvalu.png')} alt='logo' style={{width:"50px", height:"48px",marginTop:"0px"}}/>
        </NavLinkage>
      <NavLinkage to='/mcap'>
          <img src={require('../../images/spx.png')} alt='logo' style={{width:"85px", height:"50px"}}/>
        </NavLinkage>
        <NavLinkage to='/mcap' >
          <img src={require('../../images/logos/undpwhite.png')} alt='logo' style={{width:"52px", height:"70px",marginTop:"-10px", marginLeft:"-10px"}}/>
        </NavLinkage>
        <NavLinkage to='/mcap' >
          <img src={require('../../images/gef_white.png')} alt='logo' style={{width:"36px", height:"47px",marginTop:"1px", marginLeft:"-10px"}}/>
        </NavLinkage>


    
        <NavLink to='/mcap' style={{color:"white", fontWeight:"bold", fontSize:"18px", paddingLeft:'25%'}}>
        Managing Coastal Aquifer Project
        </NavLink>
        <NavMenu style={{paddingLeft:'10%'}}>
        <NavLink to='/mcap/home'>
            Home
          </NavLink>
          <NavLink to='/mcap/explorer'>
          Explorer
          </NavLink>
          <NavLink to='/mcap/reports'>
            Reports
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;
