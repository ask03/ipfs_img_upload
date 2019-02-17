const SimpleStorage = artifacts.require("./SimpleStorage.sol");

contract("SimpleStorage", accounts => {
  it("...should store the hash QmQo6GX8jpHxfJoMomNHnVwGxaEUXx3eRC7jTkPVzX5vwh.", async () => {
    const simpleStorageInstance = await SimpleStorage.deployed();

    // Set value of 89
    await simpleStorageInstance.set("QmQo6GX8jpHxfJoMomNHnVwGxaEUXx3eRC7jTkPVzX5vwh", { from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, "QmQo6GX8jpHxfJoMomNHnVwGxaEUXx3eRC7jTkPVzX5vwh", "Correct hash was not stored and returned.");
  });
});
