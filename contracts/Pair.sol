pragma solidity ^0.8.10;

import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";



contract Pair {

    address public factory = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
    address public router = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;  

    function addNewLiquidity(address _tokenA, address _tokenB, uint _amountA, uint _amountB)   external {

        IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
        IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

<<<<<<< HEAD
=======
        //address _newPair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);

>>>>>>> 2d836e7bdede775759dacc3291c6b38bb8de6ba8
        IERC20(_tokenA).approve(router , _amountA);
        IERC20(_tokenB).approve(router , _amountB);


<<<<<<< HEAD
        IUniswapV2Router02(router).addLiquidity(
            _tokenA,
            _tokenB,
            _amountA,
            _amountB,
            1,
            1,
            msg.sender,
            block.timestamp);
        
=======
        (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router02(router).addLiquidity(_tokenA, _tokenB, _amountA, _amountB, 1, 1, msg.sender, block.timestamp);
        return (amountA, amountB, liquidity);
>>>>>>> 2d836e7bdede775759dacc3291c6b38bb8de6ba8
    }

    function remouteLiquidity(address _tokenA, address _tokenB) external {
        address pair = IUniswapV2Factory(factory).getPair(_tokenA, _tokenB);

        uint256 liquidity = IERC20(pair).balanceOf(msg.sender);

        IERC20(pair).transferFrom(msg.sender, address(this), liquidity);

        IERC20(pair).approve(router, liquidity);

        IUniswapV2Router02(router).removeLiquidity(
            _tokenA,
            _tokenB,
            liquidity,
            1,
            1,
            msg.sender,
            block.timestamp
        );
    }

}   