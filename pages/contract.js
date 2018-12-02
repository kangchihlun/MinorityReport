import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'recompose'
import { Query } from 'react-apollo'
import styled from 'styled-components'
import {
  H1,
  H2,
} from '../components/Text'
import Loader from '../components/Loader'
import {
  GET_WALLET_INFO,
  GET_REGISTRATION_FEE,
} from '../lib/queries'
import Layout from '../components/Layout'
import withPolling from '../lib/withPolling'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

const Spacer = styled.div`
  width: 100%;
  height: 100px;
`

const ContractPage = ({ walletAddress }) => (
  <Layout>
    <Container>
      <Query
        query={GET_WALLET_INFO}
        variables={{ address: walletAddress }}
        skip={!walletAddress}
      >
        {({ loading, error, data }) => {
          if (loading || !data || !data.wallet) return <Loader />
          if (error) return `Error! ${error.message}`
          const { wallet } = data
          return (
            <React.Fragment>
              <H2>{wallet.address}</H2>
              <H1>{wallet.balance}</H1>
            </React.Fragment>
          )
        }}
      </Query>
      <Spacer />
      <Query
        query={GET_REGISTRATION_FEE}
      >
        {({ loading, error, data }) => {
          if (loading || !data || !data.userInformation) return <Loader />
          if (error) return `Error! ${error.message}`
          const {
            userInformation: {
              registrationFee,
            },
          } = data
          return (
            <React.Fragment>
              <H1>
                registrationFee:
              </H1>
              <H2>
                {registrationFee}
              </H2>
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
