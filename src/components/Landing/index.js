import React, {useEffect, useState} from "react";
import styled, {css, keyframes} from "styled-components";
import { ethers } from 'ethers'

import Logo from "../../images/HeaderLogo.svg";
import Martians from "../../images/rotation.gif";
import MobileLogo from "../../images/stackedheaderlogo.svg";
import ComingSoon from "../../images/coming-soon.png";
import GloomyPeek from "../../images/gloomy-peek.png";
import { useWeb3Modal } from "../../Web3ModalContext";
import {ConnectButton} from "../Navbar";
import {DogelonMartians} from "../../contracts/DogelonMartians";

function Landing() {
  const { connect, provider, address, chainId } = useWeb3Modal()
  const [mintButtonText, setMintButtonText] = useState('Mint')
  const [mintButtonEnabled, setMintButtonEnabled] = useState(true)
  const [mintButtonIsLoading, setMintButtonIsLoading] = useState(false)
  const [mintError, setMintError] = useState()
  const [contractState, setContractState] = useState({})
  const [mintCount, setMintCount] = useState(1)
  const [txState, setTxState] = useState('init') // init, waitingForUser, confirming

  useEffect(() => {
    if (!contractState.saleActive) {
      setMintButtonText('Mint')
      setMintButtonEnabled(false)
      setMintButtonIsLoading(false)
      return
    }
    switch (txState) {
      case 'init':
        setMintButtonText('Mint')
        setMintButtonEnabled(true)
        setMintButtonIsLoading(false)
        break;
      case 'waitingForUser':
        setMintButtonEnabled(false)
        setMintButtonIsLoading(true)
        break;
      case 'confirming':
        setMintButtonText('Minting...')
        setMintButtonEnabled(false)
        setMintButtonIsLoading(true)
    }
  }, [txState, contractState])

  useEffect(() => {
    const dogelonMartians = new DogelonMartians(provider);
    Promise.all([
      dogelonMartians.price(),
      dogelonMartians.saleActive(),
      dogelonMartians.currentSupply(),
      dogelonMartians.baseUri(),
    ])
      .then(([price, saleActive, currentSupply, baseUri]) => {
        setContractState({ price, saleActive, currentSupply, baseUri })
      })
      .catch((e) => {
        console.error("Error fetching contract state.", e)
      })
  }, [])

  async function mintMartian() {
    const dogelonMartians = new DogelonMartians(provider);
    setTxState('waitingForUser')
    console.log('chainId:', chainId)
    dogelonMartians.mint(mintCount, { value: contractState.price.mul(mintCount) })
      .then((tx) => {
        setTxState('confirming')
        return tx.wait()
      })
      .catch((e) => {
        setTxState('init')
        setMintError(e.message)
        console.error('error:', e)
      })
      .then((tx) => {
        setTxState('init')
        console.log(tx)
      })
  }

  const connectButton = <ConnectButton onClick={connect}>Connect Wallet</ConnectButton>
  const mintConnectButton = <ConnectButton wide={true} onClick={connect}>Connect Wallet</ConnectButton>
  const mintButton = <MintButton enabled={mintButtonEnabled} onClick={mintMartian}>
    {mintButtonText}{mintButtonIsLoading ? ' O' : ''}
  </MintButton>

  const timesSymbol = <TimesSymbol>×</TimesSymbol>

  const mintCountInput = <MintCountInput
    type="number"
    min="1"
    max="10"
    value={mintCount}
    readOnly={true}
    onKeyPress={handleMintCountChange}
  />

  function handleMintCountChange(e) {
    const keyPress = e.key
    if (keyPress === '0') {
      setMintCount(10)
    } else if ('123456789'.includes(keyPress)) {
      setMintCount(parseInt(keyPress))
    }
  }

  return (
    <Section>
      <ComingSoonImg src={ComingSoon} />
      <InfoRow>
        <InfoColumn>
          <TextWrapper>
            <MobileImg src={MobileLogo} />
            <Img src={Logo} />
            <StyledText>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam
              ultricies augue eu tellus laoreet.
            </StyledText>
            <MintPanel>
              <StatDiv>
                <StyledText alt>Total Martian Count</StyledText>
                <StyledText alt>0/10,000</StyledText>
              </StatDiv>
              <MintButtons>
                {address ? [mintButton, timesSymbol, mintCountInput] : mintConnectButton}
              </MintButtons>
            </MintPanel>
          </TextWrapper>
        </InfoColumn>
        <InfoColumn>
          <ImgWrapper>
            <Peek src={GloomyPeek} />
            <Gif src={Martians} />
          </ImgWrapper>
        </InfoColumn>
      </InfoRow>
    </Section>
  );
}

export default Landing;

const Section = styled.div`
  padding: 0 0 50px;
  max-width: 1400px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: row;
`;

const InfoColumn = styled.div`
  flex: 1;
  margin-left: 30px;
  @media screen and (max-width: 1450px) {
    margin-left: unset;
    max-width: 100%;
    flex-basis: 100%;
    display: flex;
    justify-content: center;
    text-align: center;
  }
`;

const TextWrapper = styled.div`
  margin-top: 15px;
  width: 675px;
  @media screen and (max-width: 668px) {
    width: 550px;
  }
  @media screen and (max-width: 570px) {
    width: 450px;
  }
  @media screen and (max-width: 480px) {
    width: 400px;
  }
  @media screen and (max-width: 443px) {
    width: 360px;
  }
  @media screen and (max-width: 370px) {
    width: 300px;
  }
`;

const ImgWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 50px;
  padding-top: 25px;
  @media screen and (max-width: 1450px) {
    padding-right: 0;
    margin-top: 25px;
  }
`;

const ComingSoonImg = styled.img`
  width: 500px;
  margin: 0 auto;
  margin-bottom: 20px;
    @media screen and (max-width: 1450px) {
    margin: 40px auto 80px;
    max-width: 50%;
  }
`

const Img = styled.img`
  width: 675px;
  height: auto;
  @media screen and (max-width: 685px) {
    width: 550px;
  }
  @media screen and (max-width: 570px) {
    display: none;
  }
`;

const MobileImg = styled.img`
  display: none;
  width: 410px;
  height: auto;
  @media screen and (max-width: 570px) {
    display: inline-block;
  }
  @media screen and (max-width: 443px) {
    width: 350px;
  }
  @media screen and (max-width: 390px) {
    width: 300px;
  }
`;

const Gif = styled.img`
  width: 675px;
  height: auto;
  border-radius: 10px;
  width: 500px;
  height: auto;
  box-shadow: 0 0 100px #afd8ff73;
  @media screen and (max-width: 685px) {
    width: 550px;
  }
  @media screen and (max-width: 570px) {
    width: 450px;
  }
  @media screen and (max-width: 480px) {
    width: 420px;
  }
  @media screen and (max-width: 443px) {
    width: 380px;
  }
  @media screen and (max-width: 390px) {
    width: 320px;
  }
`;

const peekAnimation = keyframes`
 0% {}
 60% {
   transform: rotate(31deg) scale(1.5);
   left: 65px;
 }
 90% {
   transform: rotate(-19deg) scale(1.5);
   left: 35px;
 }
 100% {
   transform: rotate(-19deg) scale(1.5);
   left: 35px;
 }
`

const Peek = styled.img`
    position: relative;
    margin-left: -100px;
    left: 65px;
    width: 100px;
    height: 146px;
    top: 330px;
    transition: all 1s;
    transform: rotate(31deg) scale(1.5);
    transform-origin: 65px 130px;
    animation-name: ${peekAnimation};
    animation-duration: 8s;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    z-index: -1;
    @media screen and (max-width: 775px) {
      display: none;
    }
`

const StyledText = styled.p`
  font-size: 24px;
  font-weight: 500;
  color: white;
  line-height: 40px;
  margin-top: 45px;
  margin-bottom: 50px;
  ${(props) =>
    props.alt &&
    css`
      font-size: 16px;
      font-weight: 400;
      line-height: 10px;
      margin-top: 12px;
      margin-bottom: 12px;
    `}
  @media screen and (max-width: 685px) {
    font-size: 21px;
  }
  @media screen and (max-width: 480px) {
    font-size: 18px;
  }
  @media screen and (max-width: 443px) {
    font-size: 16px;
  }
`;

const MintButton = styled.button`
  width: 220px;
  height: 50px;
  background-image: linear-gradient(to right, #56bf68 0%, #3379b0 100%);
  border: none;
  border-radius: 100px;
  font-size: 16px;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  color: white;
  transition: 0.6s;
  ${({ enabled }) => {
    if (enabled) {
      return css`
        cursor: pointer;
        &:hover {
          box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75), 0 -4px 15px 0 rgba(192, 49, 196, 0.75);
        }
      `
    }
    return css`
      cursor: not-allowed;
      opacity: .7;
    `
  }}
`;

const TimesSymbol = styled.span`
  font-size: 33px;
  color: white;
  margin: 0 10px;
  vertical-align: top;
`

const MintCountInput = styled.input`
  border transparent 1px solid;
  width: 50px;
  height: 43px;
  background: rgba(54, 125, 173, 0.2);
  font-size: 20px;
  font-family: "Lexend", sans-serif;
  font-weight: 500;
  color: white;
  border-radius: 20px;
  outline: none;
  text-align: center;
  caret-color: transparent;
  transition: 0.2s;
  &::selection {
    background: transparent;
  }
  &:focus {
    outline: none;
    border #ffffff96 1px solid;
    box-shadow: 0 4px 15px 0 rgba(49, 196, 190, 0.75), 0 -4px 15px 0 rgba(192, 49, 196, 0.75);
  }
  @media screen and (max-width: 370px) {
    margin-top: 25px;
    margin-left: 7px;
  }
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  ::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }
`;

const MintButtons = styled.div``

const MintPanel = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StatDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 312px;
  height: 90px;
  border-radius: 20px;
  background: rgba(54, 125, 173, 0.2);
  margin-bottom: 20px;
  @media screen and (max-width: 1450px) {
    width: 312px;
    margin: 20px auto;
  }
`;
