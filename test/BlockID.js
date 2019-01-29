var BlockID = artifacts.require("./BlockID.sol");

contract('BlockID', function(accounts) {
  var blockIdInstance;

  it('initializes contract with no issues', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      return blockIdInstance.address;
    }).then(function(address) {
      assert.notEqual(address, 0x0, 'has contract address');
    })
  })

  it('creates id with no issues', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      blockIdInstance.createId("Allan Kim", "male");
      return blockIdInstance.personalId(accounts[0]);
    }).then(function(id) {
      assert.equal(id.name, "Allan Kim", 'id recorded correct name');
      assert.equal(id.gender, "male", 'id recorded correct gender');
    })
  })

  it('registers name with no issues', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      blockIdInstance.registerName("Taco Bell", { from: accounts[2] });
      return blockIdInstance.returnAddress.call("Taco Bell");
    }).then(function(address) {
      assert.equal(address, accounts[2], 'it returns registered name correctly');
      return blockIdInstance.registerName("Taco Bell");
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'does not allow duplicate names');
    })
  })

})
