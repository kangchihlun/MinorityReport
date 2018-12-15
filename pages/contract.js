import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import {
  H1,
  H2,
  H3,
  P,
} from '../components/Text'
import Loader from '../components/Loader'
import {
  GET_WALLET_INFO,
  GET_PLACEHOLDER_INFO,
} from '../lib/queries'
import Layout from '../components/Layout'
import withPolling from '../lib/withPolling'

const Container = styled.div`
  width: 100vw;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Spacer = styled.div`
  width: 100%;
  height: 100px;
`

const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
`

const Box = styled.div`
  padding: 10px 20px 20px 20px;
  width: 750px;
  border: 1px solid white;
  margin-bottom: 10px;
`

const ContractPage = ({ walletAddress }) => (
  <Layout>
    <Container>
      <Spacer />
      <Query
        query={GET_WALLET_INFO}
        variables={{ address: walletAddress }}
        skip={!walletAddress}
      >
        {({ loading, error, data }) => {
          if (!walletAddress) return null
          if (loading || !data || !data.wallet) return <Loader />
          if (error) return `Error! ${error.message}`
          const { wallet } = data
          return (
            <BoxContainer>
              <Box>
                <H1>Current Active Account</H1>
                <H3>Address</H3>
                <P>{wallet.address}</P>
                <H3>Balance</H3>
                <P>{wallet.balance}</P>
              </Box>
            </BoxContainer>
          )
        }}
      </Query>
      <Spacer />
      <Query
        query={GET_PLACEHOLDER_INFO}
      >
        {({ loading, error, data }) => {
          if (loading || !data || !data.dexon) return <Loader />
          if (error) return `Error! ${error.message}`
          const {
            dexon,
            devWallets,
          } = data
          return (
            <React.Fragment>
              <BoxContainer>
                <Box>
                  <H1>
                    dexon rand
                  </H1>
                  <H2>
                    {dexon.rand}
                  </H2>
                </Box>
              </BoxContainer>
              <Spacer />
              <BoxContainer>
                {devWallets.map((devWallet, index) => (
                  <Box key={devWallet.address}>
                    <H1>
                      Dev Wallet Account
                      {' '}
                      {index + 1}
                    </H1>
                    <H3>Address</H3>
                    <P>{devWallet.address}</P>
                    <H3>PrivateKey</H3>
                    <P>{devWallet.privateKey}</P>
                    <H3>Balance</H3>
                    <P>{devWallet.balance}</P>
                  </Box>
                ))}
              </BoxContainer>
            </React.Fragment>
          )
        }}
      </Query>
    </Container>
  </Layout>
)

ContractPage.propTypes = {
  walletAddress: PropTypes.string, /* eslint-disable-line */
}

export default compose(
  withPolling,
)(ContractPage)
