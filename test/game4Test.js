const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();
		const [signer1, signer2] = await ethers.getSigners();

    return { game, signer1, signer2 };
  }
  it('should be a winner', async function () {
    const { game, signer1, signer2 } = await loadFixture(deployContractAndSetVariables);

    // nested mappings are rough :}
		await game.connect(signer2).write(signer1.address);

    await game.win(signer2.address);

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
