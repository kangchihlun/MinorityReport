import React from 'react'
import Web3 from 'web3'
import DexonRandContract from '../build/contracts/HelloDexonRand.json'
import traffleConfig from '../truffle'

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
        ? new Web3(new Web3.providers.HttpProvider(`http://127.0.0.1:${traffleConfig.networks[process.env.NODE_ENV].port}`))
        : new Web3(window.web3.currentProvider) /* eslint-disable-line */
      const dexonRand = new web3.eth.Contract(
        DexonRandContract.abi,
        DexonRandContract.networks['5777'].address,
      )
      this.dexonRand = dexonRand
      this.web3 = web3
    }

    getCurrentMetaAccount = () => this.web3.eth.getAccounts().then(([acc]) => acc)

    render() {
      const {
        dexonRand,
        getCurrentMetaAccount,
        web3,
      } = this
      return (
        <WrappedComponent
          {...this.props}
          web3={web3}
          contracts={{ dexonRand }}
          contractMethods={{}}
          getCurrentMetaAccount={getCurrentMetaAccount}
        />
      )
    }
  }
}
export default withContracts
