import React from 'react'
import styled, { keyframes } from 'styled-components'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: black;
  position: fixed;
`

const ProfileImage = styled.img`
  height: 70%;
  border-radius: 100%;
  background: white;
`

const Header = styled.div`
  height: 70px;
  background: rgb(18, 32, 40);
  display: flex;
  width: 100%;
  position: relative;
`

const HeaderContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: max-content;
  padding: 2px 0;
`

const HeaderContainerRightArea = styled.div`
  width: max-content;
  display:flex;
  justify-content: flex-end;
  align-items: center;
  height:100%;
  position: absolute;
  right: 20px;
`

const HeaderText = styled.div`
  color: white;
  text-transform: uppercase;
  font-size: 18px;
  letter-spacing: 5px;
  white-space: pre-line;
  text-align: center;
`

const Separator = styled.div`
  height: 100%;
  width: ${props => (props.width ? props.width : 100)}px;
`

const AccountAmount = styled.div`
  width: 100%;
  padding-left: 40px;
  color: white;
  text-align: right;
  position: relative;
  &:before {
    position: absolute;
    left: 0;
    content: ${props => `'${props.label}'`};
  }
`

const AmountContainer = styled.div`
  width: max-content;
  margin-right: 60px;
`

const TeamImg = styled.img`
  height: 40%;
`

const TeamTitle = styled.div`
  color: white;
  text-transform: uppercase;
  font-size: 50px;
  letter-spacing: 10px;
  opacity: ${props => (props.winner ? 1 : 0.5)};
`

const TeamWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: space-around;
  padding: 50px 0;
  opacity: ${props => (props.winner ? 1 : 1)};
`

const Shake = keyframes`
  1% {
    transform: translate(0px, 0px) rotate(0deg);
  }
  5% {
    transform: translate(1px, -1px) rotate(-1deg)
  }
  10% {
    transform: translate(2px, -2px) rotate(0deg)
  }
  15% {
    transform: translate(3px, -3px) rotate(1deg)
  }
  20% {
    transform: translate(2px, -2px) rotate(0deg)
  }
  25% {
    transform: translate(1px, -1px) rotate(-1deg)
  }
  30% {
    transform: translate(0px, 0px) rotate(0deg)
  }
  35% {
    transform: translate(-1px, 1px) rotate(1deg)
  }
  40% {
    transform: translate(-2px, 2px) rotate(0deg)
  }
  45% {
    transform: translate(-3px, 3px) rotate(-1deg)
  }
  50% {
    transform: translate(-2px, 2px) rotate(1deg)
  }
  55% {
    transform: translate(-1px, 1px) rotate(1deg)
  }
  60% {
    transform: translate(0px, 0px) rotate(0deg)
  }
`

const TeamContainer = styled.div`
  display: flex;
  width: 400px;
  border: 2px solid #8A0868;
  border-radius: 20px;
  align-items: center;
  justify-content: space-around;
  flex-direction: column;
  animation-name: ${props => props.winner && Shake};
  animation-duration: 1s;
  animation-iteration-count: infinite;
`

const WinningAmountText = styled.div`
  color: white;
  font-size: 50px;
  opacity: ${props => (props.winner ? 1 : 0.6)};
  position: relative;
  width: 100%;
  text-align: center;
  ${props => props.winner && `
    &:after {
      left: 0;
      position: absolute;
      width: 100%;
      text-align: center;
      bottom: -120px;
      content: 'Current Winner';
    }
  `}
`
const graphql = require('graphql')
const Web3 = require('web3')
const { networks } = require('../truffle')
const minorityReport = require('../build/contracts/MinorityReport.json')

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql

const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`
const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))
const minorityReportContract = new web3.eth.Contract(
  minorityReport.abi,
  minorityReport.networks['5777'].address,
)

const Team = ({ src, teamName, winner, currentAmount }) => (
    <TeamContainer winner={winner}>
      <TeamTitle winner={winner}>
        {teamName}
      </TeamTitle>
      <TeamImg src={src} />
      <WinningAmountText winner={winner}>
        {currentAmount}
      </WinningAmountText>
    </TeamContainer>
  )
  
  const Game = () => (
    <GameContainer>
      <Header>
        <HeaderContainer>
          <Separator width={30} />
          <HeaderText>
            Minority
            {'\n'}
            Report
          </HeaderText>
        </HeaderContainer>
        <HeaderContainerRightArea>
          <AmountContainer>
            <AccountAmount label="Wallet"> 100.21 DEX</AccountAmount>
            <AccountAmount label="Claimable"> 100.32221 DEX</AccountAmount>
          </AmountContainer>
          <ProfileImage src={'https://robohash.org/cool'} />
        </HeaderContainerRightArea>
      </Header>
      <TeamWrapper>
        <Team
          teamName="sun"
          src="/static/sun.png"
          currentAmount={1231.31}
        />
        <Team
          teamName="earth"
          src="/static/earth.png"
          currentAmount={213.31}
        />
        <Team
          winner
          teamName="moon"
          src="/static/moon.png"
          currentAmount={55.31}
        />
      </TeamWrapper>
    </GameContainer>
  )
  
  export default Game