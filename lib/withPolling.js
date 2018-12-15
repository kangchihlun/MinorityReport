import React from 'react'
import { compose } from 'recompose'
import {
  GET_WALLET_INFO,
} from './queries'
import withApolloProvider from './withApolloProvider'
import withContracts from './withContracts'

const withSubscription = WrappedComponent => class extends React.Component {
  static getInitialProps(ctx) {
    return WrappedComponent.getInitialProps
      ? WrappedComponent.getInitialProps(ctx)
      : WrappedComponent
  }

  constructor(props) {
    super(props)
    this.state = {
      address: '',
    }
  }

  componentDidMount() {
    this.pollingMetaMaskAccount = setInterval(() => {
      this.pollingUserWallet()
    }, 1000)
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      apolloClient: {
        watchQuery,
      },
    } = this.props
    const {
      address,
    } = this.state
    if (prevState.address !== address) {
      if (this.pollingUserInfo) {
        this.pollingUserInfo.unsubscribe()
      }
      if (address) {
        this.pollingUserInfo = watchQuery({
          query: GET_WALLET_INFO,
          variables: { address },
          pollInterval: 2000,
          ssr: false,
        }).subscribe()
      }
    }
  }

  componentWillUnmount() {
    if (this.pollingMetaMaskAccount) {
      clearInterval(this.pollingMetaMaskAccount)
    }
    if (this.pollingUserInfo) {
      this.pollingUserInfo.unsubscribe()
    }
  }

  pollingUserWallet = () => {
    const {
      getCurrentMetaAccount,
    } = this.props

    const { address } = this.state
    getCurrentMetaAccount()
      .then((newAddress) => {
        if (newAddress !== address) {
          this.setState({ address: newAddress })
        }
      })
  }

  render() {
    // ... and renders the wrapped component with the fresh data!
    // Notice that we pass through any additional props
    const { address } = this.state
    return <WrappedComponent {...this.props} walletAddress={address} />
  }
}


export default compose(
  withApolloProvider,
  withContracts,
  withSubscription,
)
