import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import {useWeb3Modal} from "../../Web3ModalContext";

import Logo from "../../images/logo.png";
import Arrow from "../../images/arrow.svg";
import Instagram from "../../images/instagram.svg";
import Twitter from "../../images/twitter.svg";
import Telegram from "../../images/telegram.svg";
import Desktop from "../../images/desktop.svg";
import OpenSea from "../../images/opensea.svg"

function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const { connect, disconnect, address } = useWeb3Modal()

  const shortAddress = address ?
    `${address.slice(0,6)}...${address.slice(-4)}`
    : null

  let menuRef = useRef()

  useEffect(() => {
    let handler = (event) => {
      if (!menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  })

  const ConnectButtonOrAddress = address ?
    <Address onClick={disconnect}>
      <AddressText>Connected: <code>{shortAddress}</code></AddressText>
      <DisconnectText>Disconnect</DisconnectText>
    </Address>
    : <ConnectButton onClick={connect}>Connect Wallet</ConnectButton>


  return (
    <Header>
      <Container>
        <A href="#">
          <HeaderLogo src={Logo} />
        </A>
        <SubContainer>
          <Dropdown ref={menuRef}>
            <DropdownButton  onClick={() => setIsOpen(!isOpen)}>
              <Links>Community</Links>
              <ArrowIcon isOpen={isOpen} src={Arrow} />
            </DropdownButton>
            <DropdownBody isOpen={isOpen}>
              <A href="https://dogelonmars.com/" target="_blank">
                <DropdownItem>
                  <CommunityIcons src={Desktop} />
                  <DropdownText>Dogelon Mars</DropdownText>
                </DropdownItem>
              </A>
              <A href="https://t.me/dogelonmars" target="_blank">
                <DropdownItem>
                  <CommunityIcons src={Telegram} />
                  <DropdownText>Telegram</DropdownText>
                </DropdownItem>
              </A>
              <A href="https://twitter.com/dogelonmars" target="_blank">
                <DropdownItem>
                  <CommunityIcons src={Twitter} />
                  <DropdownText>Twitter</DropdownText>
                </DropdownItem>
              </A>
              <A href="https://www.instagram.com/dogelonmars/" target="_blank">
                <DropdownItem>
                  <CommunityIcons src={Instagram} />
                  <DropdownText>Instagram</DropdownText>
                </DropdownItem>
              </A>
              <A href="#" target="_blank">
                <DropdownItem>
                  <CommunityIcons src={OpenSea} />
                  <DropdownText>OpenSea</DropdownText>
                </DropdownItem>
              </A>
            </DropdownBody>
          </Dropdown>
          <ButtonDiv>
            <Links>OpenSea</Links>
            {ConnectButtonOrAddress}
          </ButtonDiv>
        </SubContainer>
      </Container>
    </Header>
  );
}

export default Nav;

const Header = styled.div`
  margin: 0 auto;
  max-width: 1400px;
  width: 100%;
  @media screen and (max-width: 1450px) {
    width: 90%;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 35px 0;
`;

const HeaderLogo = styled.img`
  margin-right: 25px;
  text-decoration: none;
  width: 50px;
  height: auto;
`;

const SubContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Dropdown = styled.div``;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  font-size: 14px;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  transition: 0.3s;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
`;

const DropdownItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  border-radius: 24px;
  &:hover {
    background-color: #eeeeee;
  }
`;

const DropdownBody = styled.div`
  position: absolute;
  margin-top: 20px;
  width: 270px;
  padding: 16px;
  border-radius: 20px;
  background: white;
  visibility: ${( { isOpen }) => isOpen ? "visible" : "hidden"};
  @media screen and (max-width: 604px) {
    padding: 0px;
    margin-top: 25px;
    padding-top: 10px;
    padding-bottom: 10px;
    left: 0;
    width: 100%;
    border-radius: 0px;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media screen and (max-width: 604px) {
    display:none;
  }
`;

export const ConnectButton = styled.button`
  width: 180px;
  height: 50px;
  background-image: linear-gradient(to right, #56bf68 0%, #3379b0 100%);
  border: none;
  border-radius: 100px;
  cursor: pointer;
  font-size: 16px;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  color: white;
  transition: 0.6s;
  &:hover {
    box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75), 0 -4px 15px 0 rgba(192, 49, 196, 0.75);
  }
  
  ${({ wide }) => {
    if (wide) {
      return 'width: 312px;'
    }
  }}
`;

const AddressText = styled.div`
  transition: 0.6s;
`

const DisconnectText = styled.div`
  opacity: 0;
  position: relative;
  top: -20px;
  height: 0;
  transition: 0.6s;
`

const Address = styled.button`
  height: 50px;
  padding: 0 20px;
  background-image: linear-gradient(to right, #56bf68 0%, #3379b0 100%);
  border: none;
  border-radius: 100px;
  font-size: 16px;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  color: white;
  cursor: pointer;
  transition: 0.6s;
  
  &:hover {
    box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75), 0 -4px 15px 0 rgba(192, 49, 196, 0.75);
  } 
  
  &:hover ${AddressText} {
    opacity: 0;
  }
  
  &:hover ${DisconnectText} {
    opacity: 1;
  }
`

const Links = styled.a`
  text-decoration: none;
  color: white;
  font-weight: 400;
  margin-right: 25px;
  cursor: pointer;
  opacity: 0.8;
  transition: 0.3s;
  &:hover {
    opacity: 1;
  }
`;

const ArrowIcon = styled.img`
  margin-left: -8px;
  transition: 0.3s;
  transform: ${( { isOpen }) => isOpen ? "rotate(90deg)" : "rotate(0deg)"}
`;

const CommunityIcons = styled.img`
  margin-right: 12px;
  width: 30px;
  height: 30px;
  opacity: 0.8;
`;

const DropdownText = styled.div`
  font-family: "Lexend", sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: black;
  opacity: 0.8;
`;

const A = styled.a`
  text-decoration: none;
`