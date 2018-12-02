const graphql = require('graphql')
const Web3 = require('web3')
const { networks } = require('../../truffle')
const { div } = require('../../utils/calculation')
const playerBook = require('../../build/contracts/PlayerBook.json')

const {
  GraphQLObjectType,
  GraphQLString,
} = graphql

const rpcEndpoint = `http://${networks.development.host}:${networks.development.port}`

const web3 = new Web3(new Web3.providers.HttpProvider(rpcEndpoint))
const {
  utils,
} = web3

const playerBookContract = new web3.eth.Contract(
  playerBook.abi,
  playerBook.networks['5777'].address,
)

const {
  methods: {
    registrationFee_,
  },
} = playerBookContract


const UserInformationType = new GraphQLObjectType({
  name: 'UserInformationType',
  fields: {
    registrationFee: {
      type: GraphQLString,
      resolve: () => registrationFee_().call().then(fee => div(fee, utils.unitMap.ether)),
    },
  },
})

module.exports = UserInformationType
