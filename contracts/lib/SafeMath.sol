pragma solidity ^0.4.19;

/**
 * @title SafeMath
 * @dev Math operations with safety checks that revert on error
 */
library SafeMath {

  /**
    * @dev Multiplies two numbers, throws on overflow.
    */
    function mul(uint256 a, uint256 b) 
        internal 
        pure 
        returns (uint256 c) 
    {
        if (a == 0) {
            return 0;
        }
        c = a * b;
        require(c / a == b, "SafeMath mul failed");
        return c;
    }

  /**
  * @dev Integer division of two numbers truncating the quotient, reverts on division by zero.
  */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0); // Solidity only automatically asserts when dividing by 0
        uint256 c = a / b;
      // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

  /**
    * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b)
        internal
        pure
        returns (uint256) 
    {
        require(b <= a, "SafeMath sub failed");
        return a - b;
    }

  /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b)
        internal
        pure
        returns (uint256 c) 
    {
        c = a + b;
        require(c >= a, "SafeMath add failed");
        return c;
    }

  /**
  * @dev Divides two numbers and returns the remainder (unsigned integer modulo),
  * reverts when dividing by zero.
  */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
    /**
        * @dev gives square. multiplies x by x
        */
    function sq(uint256 x)
        internal
        pure
        returns (uint256)
    {
        return (mul(x,x));
    }

  /**
     * @dev gives square root of given x.
     */
    function sqrt(uint256 x)
        internal
        pure
        returns (uint256 y) 
    {
        uint256 z = ((add(x,1)) / 2);
        y = x;
        while (z < y) 
        {
            y = z;
            z = ((add((x / z),z)) / 2);
        }
    }
    /**
     * @dev logarithm
     */
    function pow(uint256 a, uint256 b) internal pure returns (uint256){
        uint256 num = a**b;
        return num;
    }
    /**
     * @dev logarithm
     */
    function log(uint256 a) internal pure returns (uint256) {
        uint256 x = a;
        uint256 y = (((x & (x - 1)) == 0) ? 0 : 1);
        uint256 j = 128;
        uint256 k = 0;

        k = (((x & 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF00000000000000000000000000000000) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0xFFFFFFFFFFFFFFFF0000000000000000) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0xFFFFFFFF00000000) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0x00000000FFFF0000) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0x000000000000FF00) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0x00000000000000F0) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0x000000000000000C) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        k = (((x & 0x0000000000000002) == 0) ? 0 : j);
        y += k;
        x >>= k;
        j >>= 1;

        return y;
    }

    function percent(uint numerator, uint denominator, uint precision) public 
            constant returns(uint quotient) 
    {
         // caution, check safe-to-multiply here
        uint _numerator  = numerator * 10 ** (precision+1);
        // with rounding of last digit
        uint _quotient =  ((_numerator / denominator) + 5) / 10;
        return ( _quotient);
    }
}
