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
  font-size: 40px;
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
      content: 'Current Minority';
    }
  `}
`
const graphql = require('graphql')
var secret = require('../secret');
var mnemonic = secret.mnemonic;
const Web3 = require('web3')
const { networks } = require('../truffle')
var HDWalletProvider = require("truffle-hdwallet-provider");
const minorityReport = require('../build/contracts/MinorityReport.json')
const { toChecksumAddress } = require('ethereumjs-util')

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql




const Team = ({ src, teamName, winner, currentAmount, ...rest }) => (
    <TeamContainer winner={winner} {...rest}>
      <TeamTitle winner={winner}>
        {teamName}
      </TeamTitle>
      <TeamImg src={src} />
      <WinningAmountText winner={winner}>
        {currentAmount}
      </WinningAmountText>
    </TeamContainer>
  )
  class Game extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        winner_is_sun: false,
        winner_is_moon: false,
        winner_is_earth: false,
        AccountBalance: '',
        activeAccount: '',
        sun_pot_value:0,
        moon_pot_value:0,
        earth_pot_value:0,
      }

      const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`

      // 不能在建構式叫 window 這時候還不存在
      //window.dexon.enable()
      // this.web3 = new Web3(window.dexon)
      // const minorityReportContract = new web3.eth.Contract(
      //   minorityReport.abi,
      //   toChecksumAddress(minorityReport.networks['5777'].address),
      // )
      // this.mContract = minorityReportContract
    } 
    fn_refreshWallet = () => {
      this.web3.eth.getAccounts()
      .then(accounts => {
        this.web3.eth.getBalance(accounts[0])
        .then(r => {
           this.setState({ AccountBalance: r, activeAccount: accounts[0] })
           //console.log( this.mContract.methods)
           // this.mContract.methods.func().call().then(r => { .... })
           // this.mContract.methods.func().send({ from: [] }).then(r => { .... })
        })
      })
    }
    
    fn_refreshPotValue = ()=>{
      this.mContract.methods.getPotValue(0).call().then(
        ret_s => {
          //console.log(ret_s)
          // this.setState({ sun_pot_value: ret_s })
          // this.mContract.methods.getPotValue(1).call().then(
          //   ret_e =>{
          //     this.setState({ earth_pot_value: ret_e })
          //     this.mContract.methods.getPotValue(2).call().then(
          //       ret_m =>{
          //         this.setState({ moon_pot_value: ret_m })
                  
          //     })
          // })
      });
    }

    componentDidMount() {
      const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`
      //window.dexon.enable()
      const web3_ = new Web3(window.dexon)
      this.web3 = web3_
      const minorityReportContract = new web3_.eth.Contract(
        minorityReport.abi,
        toChecksumAddress(minorityReport.networks['5777'].address),
      )
      this.mContract = minorityReportContract
      
      
      // start timer 
      this.polling = setInterval(() => {
        this.fn_refreshWallet()
      }, 1000)      
    }

    // remover timer
    componentWillUnmount() {
      if(this.polling) {
        clearInterval(this.polling)
      }
    }

    sun_clicked =() => {
      //console.log(this.state.mContract.methods)
      console.log(this.state.activeAccount)
      this.mContract.methods.Vote(0).send({
        from:this.state.activeAccount,value: 1e+16,
        gas:210000
      }).then(
        ret=>{
          this.fn_refreshPotValue()
        }
      )
      // myContract.methods.myMethod(123).send({
      //   from: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
      // });
      
    }

    earth_clicked =() => {
      //console.log(this.state.mContract.methods)
      console.log('Earth Clicked')
      this.mContract.methods.Vote(1).send({
        from:this.state.activeAccount,value: 1e+16
      }).then(
        ret=>{
          this.fn_refreshPotValue()
        }
      )
    }

    moon_clicked =() => {
      //console.log(this.state.mContract.methods)
      console.log('Moon Clicked')
      this.mContract.methods.Vote(2).send({
        from:this.state.activeAccount,value: 1e+16
      }).then(
        ret=>{
          this.fn_refreshPotValue()
        }
      )
    }

    render() {
      return (
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
                <AccountAmount
                  
                label="Wallet"> {this.state.AccountBalance} DEX</AccountAmount>
                <AccountAmount label="Claimable"> {this.state.activeAccount}</AccountAmount>
              </AmountContainer>
              <ProfileImage src={'https://robohash.org/cool'} />
            </HeaderContainerRightArea>
          </Header>
          <TeamWrapper>
            <Team onClick={() => this.sun_clicked()}
              teamName="sun"
              src="/static/sun.png"
              currentAmount={this.state.sun_pot_value}
              winner={this.state.winner_is_sun}
            />
            <Team onClick={() => this.earth_clicked()}
              teamName="earth"
              src="/static/earth.png"
              currentAmount={this.state.earth_pot_value}
              winner={this.state.winner_is_earth}
            />
            <Team onClick={() => this.moon_clicked()}
              teamName="moon"
              src="/static/moon.png"
              currentAmount={this.state.moon_pot_value}
              winner={this.state.winner_is_moon}
            />
          </TeamWrapper>
        </GameContainer>
      )
    }
  }
  
  

  export default Game