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


const Web3 = require('web3')
const minorityReport = require('../build/contracts/MinorityReport.json')
var HDWalletProvider = require("truffle-hdwallet-provider");
var secret = require('../secret');
var mnemonic = secret.mnemonic;
const { toChecksumAddress } = require('ethereumjs-util')

//new HDWalletProvider(mnemonic,
//  "http://testnet.dexon.org:8545", 0, 1, true, "m/44'/237'/0'/0/")
const provider = new HDWalletProvider(
  mnemonic,
  'http://127.0.0.1:8545'
)
// const web3 = new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:8545`))
const web3 = new Web3(provider)
const minorityReportContract = new web3.eth.Contract(
    minorityReport.abi,
    toChecksumAddress(minorityReport.networks['5777'].address),
  )
console.log(toChecksumAddress(minorityReport.networks['5777'].address))
console.log(minorityReportContract.methods)
//console.log()


// web3.eth.getAccounts().then(r => {
//    console.log(r)
//    minorityReportContract.methods.activate().send
//    ({
//     from:r[0]   
//    })
//    .then(rr => {
//       //const prevBalance_a0 = (await web3.eth.getBalance(r[0])).toNumber();
//       minorityReportContract.methods.Vote(0 , { from: r[0], value: 1e+18 });
//    })
// })

class Me extends React.PureComponent {

  componentDidMount() {
    // const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`
    // //window.dexon.enable()
    // const web3 = new Web3(window.dexon)
    // const minorityReportContract = new web3.eth.Contract(
    //   minorityReport.abi,
    //   toChecksumAddress(minorityReport.networks['5777'].address),
    // )
    // this.state.mContract = minorityReportContract
    // console.log(this.state.mContract.methods)

    const start = async () => {
      const accounts = await web3.eth.getAccounts()
      const balance = await web3.eth.getBalance(accounts[0])
      console.log(balance)
      minorityReportContract.methods.activate().send({
        from:accounts[0]
      })
      // .then(rr => {
      //       //const prevBalance_a0 = (await web3.eth.getBalance(r[0])).toNumber();
      //       //const { votelogs } = minorityReportContract.methods.Vote(0 , { from: accounts[0], value: 1e+15 });
      // })
    }
    
    start()
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
          </Header>
      </GameContainer>
    )
  }
}

export default Me