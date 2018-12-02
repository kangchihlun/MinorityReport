import React from 'react'
import Web3 from 'web3'
import BallotContract from '../build/contracts/PlayerBook.json'

function withContracts(WrappedComponent) {
  return class extends React.Component {
    static getInitialProps(ctx) {
      return WrappedComponent.getInitialProps
        ? WrappedComponent.getInitialProps(ctx)
        : WrappedComponent
    }

    constructor(props) {
      super(props)
      const web3 = !process.browser
        ? new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'))
        : new Web3(window.web3.currentProvider) /* eslint-disable-line */
      const ballot = new web3.eth.Contract(
        BallotContract.abi,
        BallotContract.networks['5777'].address,
      )
      this.ballot = ballot
      this.web3 = web3
    }

    getCurrentMetaAccount = () => this.web3.eth.getAccounts().then(([acc]) => acc)

    render() {
      const {
        ballot,
        getCurrentMetaAccount,
        web3,
      } = this
      return (
        <WrappedComponent
          {...this.props}
          web3={web3}
          contracts={{ ballot }}
          contractMethods={{}}
          getCurrentMetaAccount={getCurrentMetaAccount}
        />
      )
    }
  }
}
export default withContracts
