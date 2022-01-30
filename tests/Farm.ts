const { expect } = require('chai');
const { ethers } = require('hardhat');
const { collectCompilations } = require('truffle');


describe('Farm contract', () => {
    
    let Token1, token1, Token2, token2, pair, Pair, Farm, farm, owner, addr1, addr2;

    beforeEach(async () => {
        Farm = await ethers.getContractFactory(process.env.FARM_NAME);
        Pair = await ethers.getContractFactory(process.env.PAIR_NAME);
        Token1 = await ethers.getContractFactory(process.env.TOKEN_NAME1);
        Token2 = await ethers.getContractFactory(process.env.TOKEN_NAME2);

        pair = await Pair.deploy();
        token1 = await Token1.deploy();
        token2 = await Token2.deploy();
        farm = await Farm.deploy(token1.address, token2.address, token2.address);

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

            await token2.approve(farm.address, "50");
            console.log(await token2.allowance(token2.address, farm.address));
            await farm.stake("50");
            console.log(farm.userInfo[owner.address].stakingBalance);
            expect(await farm.userInfo[owner.address].stakingBalance).to.equal("50");
        });

        it('Should unstake', async () => {

            await token2.approve(farm.address, "50");
            console.log(await token2.allowance(token2.address, farm.address));

            await farm.stake("50");
            console.log(farm.userInfo[owner.address].stakingBalance);

            await farm.unstake("50");
            console.log(farm.userInfo[owner.address].stakingBalance);
            expect(await farm.userInfo[owner.address].stakingBalance).to.equal("50");
        });

        it('Change proccent rewars', async () => {
            console.log(await farm.getProccentRewars());
            await farm.changeProccentRewars("50");
            console.log(await farm.getProccentRewars());
            expect(await farm.getProccentRewars()).to.equal("50");
        });

        it('Change timelock', async () => {
            console.log(await farm.getTimeLock());
            await farm.changeTimeLock("100");
            console.log(await farm.getTimeLock());
            expect(await farm.getTimeLock()).to.equal("100");
        });

        it('Claim rewords', async () => {

        });

    });

});