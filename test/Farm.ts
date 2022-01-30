const { expect } = require('chai');
const { ethers } = require('hardhat');
const { collectCompilations } = require('truffle');
const { expectRevert, time } = require('@openzeppelin/test-helpers');


describe('Farm contract', () => {
    
    let Token1, token1, Token2, token2, pair, Pair, Farm, farm, owner, addr1, addr2;

    beforeEach(async () => {
        Farm = await ethers.getContractFactory("Farm");
        Pair = await ethers.getContractFactory("Pair");
        Token1 = await ethers.getContractFactory("Token1");
        Token2 = await ethers.getContractFactory("Token2");

        pair = await Pair.deploy();
        token1 = await Token1.deploy();
        token2 = await Token2.deploy();
        farm = await Farm.deploy(token1.address, token2.address);

        [owner, addr1, addr2] = await ethers.getSigners();


    });

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            expect(await farm.owner()).to.equal(owner.address);
        });

    });

    describe('Ownable', () => {
        it('Should change owner', async () => {
            await farm.transferOwnership(addr1.address);

            expect(await farm.connect(addr1).isOwner()).to.equal(true);
        });

        it('Should renounce owner', async () => {
            await farm.renounceOwnership();

            expect(await farm.isOwner()).to.equal(false);
        });
    });

    describe('Stake', () => {
        it('Should stake', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            expect(await farm.getStakingBalance()).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
        });

        it('Should unstake', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await time.increase(1000);

            await farm.unstake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            expect(await farm.getStakingBalance()).to.equal("0");
        });

        it('Should unstake not all tokens', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await time.increase(1000);

            await farm.unstake(ethers.utils.parseUnits("40", process.env.TOKEN_DECIMALS));

            expect(await farm.getStakingBalance()).to.equal(ethers.utils.parseUnits("10", process.env.TOKEN_DECIMALS));
        });

        it('Change proccent rewars', async () => {

            await farm.changeProccentRewards(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            expect(await farm.getProccentRewards()).to.equal(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
        });

        it('Change timelock', async () => {

            await farm.changeTimeLock(ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));

            expect(await farm.getTimeLock()).to.equal(ethers.utils.parseUnits("100", process.env.TOKEN_DECIMALS));
        });

        it('Stake start time', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            

            const farmTime = await farm.getStartTime();

            await time.increase(605);

            expect(await farm.timeStaking(owner.address)).to.equal("605");
        });

    });

    describe("Claim", function () {

        it('Claim rewords', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await token1.transfer(farm.address, ethers.utils.parseUnits("1000", process.env.TOKEN_DECIMALS));

            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await time.increase(605);

            await farm.claim();

            expect(await token1.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("9010", process.env.TOKEN_DECIMALS));
        });

        it('Balance rewords tokens on farm contract', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            
            await token1.transfer(farm.address, ethers.utils.parseUnits("1000", process.env.TOKEN_DECIMALS));
            await time.increase(605);

            await farm.claim();
            expect(await token1.balanceOf(farm.address)).to.equal(ethers.utils.parseUnits("990", process.env.TOKEN_DECIMALS));
        });

        it('Claim rewords after add tokens on stake', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await token1.transfer(farm.address, ethers.utils.parseUnits("1000", process.env.TOKEN_DECIMALS));

            await time.increase(605);
            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await time.increase(605);

            await farm.claim();
            expect(await token1.balanceOf(owner.address)).to.equal(ethers.utils.parseUnits("9030", process.env.TOKEN_DECIMALS));
        });

        it('Check rewords balance', async () => {

            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            await time.increase(605);
            await token2.approve(farm.address, ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));
            await farm.stake(ethers.utils.parseUnits("50", process.env.TOKEN_DECIMALS));

            expect(await farm.getRewordsTokenBalance()).to.equal(ethers.utils.parseUnits("10", process.env.TOKEN_DECIMALS));
        });

    });

});