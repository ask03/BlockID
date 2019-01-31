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
      assert.equal(id.firstName, "Allan Kim", 'id recorded correct name');
      assert.equal(id.gender, "male", 'id recorded correct gender');
    })
  })

  it('registers and returns name with no issues', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      blockIdInstance.registerName("Taco Bell", { from: accounts[2] });
      return blockIdInstance.returnAddress.call("Taco Bell");
    }).then(function(address) {
      assert.equal(address, accounts[2], 'it returns registered name correctly');
      return blockIdInstance.registerName("Taco Bell");
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'does not allow duplicate names');
      return blockIdInstance.returnAddress.call("Taco Bell");
    }).then(function(addressTwo) {
      console.log(addressTwo);
      console.log(accounts[2]);
      assert.equal(addressTwo, accounts[2], 'it returns correct address for registered name');
      return blockIdInstance.returnAddress("donkey");
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'it reverts for non registered name');
    })
  })

  it('registers viewer allowance correctly', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      return blockIdInstance.setAllow("Taco Bell", 1, { from:accounts[0] });
    }).then(function(receipt) {
      assert(receipt.logs.length, 1, 'triggers allowed event');
      assert(receipt.logs[0].event, 'Allowed', 'should be "Allowed" event');
      assert(receipt.logs[0].args._from, accounts[0], 'logs the account that gave allowance');
      assert(receipt.logs[0].args._to, accounts[2], 'lots the account which was allowed');
      assert(receipt.logs[0].args._class, 1, 'logs the class of allowance');
      return blockIdInstance.idAllowance(accounts[0], accounts[2]);
    }).then(function(idClass) {
      console.log(idClass);
      assert.equal(idClass, 1);
    })
  })

  it('requests ID properly', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      return blockIdInstance.requestId(accounts[0], { from: accounts[3] });
  }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert' >= 0, 'it reverts non allowed request'));
    })
  })
})
