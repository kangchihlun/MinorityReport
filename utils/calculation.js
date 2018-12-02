const Big = require('big.js')

const RM = {
  ROUND_DOWN: 0,
  ROUND_HALF_UP: 1,
  ROUND_HALF_EVEN: 2,
  ROUND_UP: 3,
}

Big.RM = RM.ROUND_DOWN

const catchWraper = fn => ((...args) => {
  try {
    return fn(...args)
  } catch (e) {
    return undefined
  }
})

const OperationGenerator = op => (
  (...args) => (
    args.reduce(
      (sum, val) => (sum ? sum[op](val) : Big(val)),
      undefined,
    )
  ).toFixed()
)

const ComparisonGenerator = op => (
  (arg1, arg2) => (Big(arg1)[op](Big(arg2)))
)

const add = catchWraper(OperationGenerator('plus'))
const sub = catchWraper(OperationGenerator('minus'))
const mul = catchWraper(OperationGenerator('times'))
const div = catchWraper(OperationGenerator('div'))
const mod = catchWraper(OperationGenerator('mod'))

const eq = catchWraper(ComparisonGenerator('eq'))
const gte = catchWraper(ComparisonGenerator('gte'))
const lte = catchWraper(ComparisonGenerator('lte'))
const gt = catchWraper(ComparisonGenerator('gt'))
const lt = catchWraper(ComparisonGenerator('lt'))

const round = catchWraper((num, precision = 10, type = RM.ROUND_DOWN) => (
  Big(num).round(precision, type).toFixed()
))

const toPrecision = catchWraper(
  (num, precision) => Big(num).toPrecision(precision),
)

module.exports = {
  add,
  sub,
  mul,
  div,
  mod,
  eq,
  lte,
  gt,
  lt,
  gte,
  round,
  toPrecision,
}
