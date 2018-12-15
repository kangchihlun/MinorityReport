const graphql = require('graphql')
const _ = require('lodash')
const Web3 = require('web3')
const { networks } = require('../../truffle')
const { div } = require('../../utils/calculation')
const DexonInformationType = require('./dexon')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
} = graphql

const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`

const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))

const {
  utils,
  eth: {
    getBalance,
  },
} = web3

const WalletType = new GraphQLObjectType({
  name: 'WalletType',
  fields: () => ({
    address: { type: GraphQLString },
    balance: {
      type: GraphQLString,
      resolve: ({ address }) => getBalance(address)
        .then(balance => div(balance, utils.unitMap.ether)),
    },
  }),
})

const DevWalletType = new GraphQLObjectType({
  name: 'DevWalletType',
  fields: () => ({
    address: { type: GraphQLString },
    privateKey: { type: GraphQLString },
    balance: {
      type: GraphQLString,
      resolve: ({ address }) => getBalance(address)
        .then(balance => div(balance, utils.unitMap.ether)),
    },
  }),
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    dexon: {
      type: DexonInformationType,
      resolve: () => ({}),
    },
    wallet: {
      type: WalletType,
      args: {
        address: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, { address }) => ({ address }),
    },
    // devWallets: {
    //   type: new GraphQLList(DevWalletType),
    //   resolve: (parent, args, context) => {
    //     const accounts = []
    //     _.mapKeys(context.accounts, (value, key) => {
    //       accounts.push({
    //         address: key,
    //         privateKey: `0x${Buffer.from(value.secretKey.data).toString('hex')}`,
    //       })
    //     })
    //     return accounts
    //   },
    // },
  },
})


module.exports = new GraphQLSchema({
  query: RootQuery,
})
