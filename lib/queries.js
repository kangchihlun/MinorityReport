import gql from 'graphql-tag'

export const GET_WALLET_INFO = gql`
  query GET_WALLET_INFO($address: String!) {
    wallet(address: $address) {
      address
      balance
    }
  }
`

export const GET_PLACEHOLDER_INFO = gql`
  query GET_PLACEHOLDER_INFO{
    dexon {
      rand
    }
    devWallets {
      address
      privateKey
      balance
    }
  }
`
