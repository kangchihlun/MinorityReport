const ganache = require('ganache-cli')
const path = require('path')
const fs = require('fs')
const fsExtra = require('fs-extra')
const _ = require('lodash')
const moment = require('moment')
const { systemLogger } = require('./utils/logger')


ganache.server({
  network_id: '5777',
  total_accounts: 6,
  verbose: true,
  logger: {
    log: (x) => {
      const str = _.replace(x, new RegExp(/(>|<)/, 'g'), '')
      let result
      try {
        result = JSON.stringify(JSON.parse(str), null, 2)
      } catch (error) {
        result = str
      }
      return systemLogger({
        message: `
${moment().format('YYYY-MM-DD hh:mm:ss')}

${result}
`,
      })
    },
  },
}).listen(8545, (ganacheServerErr, blockchain) => {
  systemLogger({
    message: `
RPC Server ready at 
http://localhost:8545
`,
  })

  const buildPath = path.resolve(process.env.PWD, 'build', 'accounts.json')
  fsExtra.ensureFileSync(buildPath)
  fs.writeFileSync(buildPath, JSON.stringify(blockchain.unlocked_accounts, null, 2))
  systemLogger({
    message: `
Test Accounts Information written in
${buildPath}
`,
  })
})
