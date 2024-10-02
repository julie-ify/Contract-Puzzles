const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
	async function deployContractAndSetVariables() {
		const Game = await ethers.getContractFactory('Game5');
		const game = await Game.deploy();
		const owner = await ethers.getSigner(0);

		thresholdBytes20 = ethers.utils.hexlify(
			ethers.utils.zeroPad('0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf', 20)
		);
		return { game, owner, thresholdBytes20 };
	}

	it('should be a winner', async function () {
		const { game, owner, thresholdBytes20 } = await loadFixture(
			deployContractAndSetVariables
		);

		let validWallet;
		let validAddress;

		while (!validWallet) {
			const wallet = ethers.Wallet.createRandom();

			const walletBytes20 = ethers.utils.hexlify(
				ethers.utils.zeroPad(wallet.address, 20)
			);

			if (
				ethers.BigNumber.from(walletBytes20).lt(
					ethers.BigNumber.from(thresholdBytes20)
				)
			) {
				validWallet = wallet;
				validAddress = wallet.address;
				break;
			}
		}

		await owner.sendTransaction({
			to: validAddress,
			value: ethers.utils.parseEther('.1'),
		});

		// Connect the valid wallet to the provider and call the win() function
		const validSigner = validWallet.connect(ethers.provider);
		const tx = await game.connect(validSigner).win();
		await tx.wait();

		assert(await game.isWon(), 'You did not win the game');
	});
});
