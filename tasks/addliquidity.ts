import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";

task("addliquidity", "ERC-20 addLiquidity")
    .addParam("tokena", "TokenA address")
    .addParam("tokenb", "TokenA amount")
    .addParam("amounta", "TokenB address")
    .addParam("amountb", "TokenB amount")
    .setAction(async (taskArgs) => {

      const token = await hre.ethers.getContractAt("Pair", 0x905812daBB0e9e7121BCDf8c07EdE38d8351D46C);

      const [sender] = await hre.ethers.getSigners();

      await token.addNewLiquidity(taskArgs.tokenA, taskArgs.tokenB, taskArgs.amountA, taskArgs.amountB);

    });

export default  {};