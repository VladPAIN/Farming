import "@nomiclabs/hardhat-ethers";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-web3";

task("approve", "Approve")
    .addParam("sender", "Sender address")
    .addParam("spender", "Spender address")
    .addParam("amounttoken1", "Token1 amount")
    .addParam("amounttoken2", "Token2 amount")
    .setAction(async (args) => {

        const token1 = await hre.ethers.getContractAt(process.env.TOKEN_NAME1, process.env.TOKEN1_ADDRESS);
        await (await token1.approve(args.spender, hre.ethers.utils.parseUnits(args.amounttoken1, process.env.TOKEN_DECIMALS))).wait()
        console.log(await token1.allowance(args.sender, args.spender));

        const token2 = await hre.ethers.getContractAt(process.env.TOKEN_NAME2, process.env.TOKEN2_ADDRESS);
        await (await token2.approve(args.spender, hre.ethers.utils.parseUnits(args.amounttoken2, process.env.TOKEN_DECIMALS))).wait()
        console.log(await token2.allowance(args.sender, args.spender));
 

    });

export default  {};