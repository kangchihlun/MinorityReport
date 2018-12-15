const graphql = require('graphql')
const Web3 = require('web3')
const { networks } = require('../../truffle')
const dexonRand = require('../../build/contracts/HelloDexonRand.json')

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql

const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`

const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))

const dexonRandContract = new web3.eth.Contract(
  dexonRand.abi,
  dexonRand.networks['5777'].address,
)

const {
  methods: {
    value,
  },
} = dexonRandContract


const DexonInformationType = new GraphQLObjectType({
  name: 'DexonInformationType',
  fields: {
    rand: {
      type: GraphQLString,
      resolve: () => value().call().then(rand => rand),
    },
  },
})

module.exports = DexonInformationType
