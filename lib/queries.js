import gql from 'graphql-tag'

export const GET_WALLET_INFO = gql`
  query GET_WALLET_INFO($address: String!) {
    wallet(address: $address) {
      address
      balance
    }
  }
`

export const GET_REGISTRATION_FEE = gql`
  query GET_USER_INFO {
    userInformation {
      registrationFee
    }
    metadata {
      timestamp
    }
  }
`
