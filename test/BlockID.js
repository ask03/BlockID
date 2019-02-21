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
      blockIdInstance.createId("WhyHelloThere", "Allan", "Sung Chan", "Kim", "USA",
      "Qmc8UqSzDTHJC2tiN89gxfVHAJSDk55s3roM6KrYZknYiE", 17198512, 1, true);
      return blockIdInstance.personalId(accounts[0]);
    }).then(function(id) {
      assert.equal(id.firstName, "Allan", 'id recorded correct first name');
      assert.equal(id.middleName, "Sung Chan", 'id recorded correct middle name');
      assert.equal(id.lastName, "Kim", 'id recorded correct last name');
      assert.equal(id.nationality, "USA", 'id recorded correct nationality');
      assert.equal(id.imgHash, "Qmc8UqSzDTHJC2tiN89gxfVHAJSDk55s3roM6KrYZknYiE", "id has correct imgHash");
      assert.equal(id.dob, 17198512, 'id recorded correct dob');
      assert.equal(id.ethnicity, 1, 'id recorded correct ethnicity');
      assert.equal(id.gender, true, 'id recorded correct gender');
      return blockIdInstance.createId("WhyHelloThere", "","","","","", 1234567,1, true);
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'it reverts for duplicate username');

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
      return blockIdInstance.registerName("thedon", {from: accounts[2]});
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'does not allow an address to have more than one name');
      return blockIdInstance.returnAddress.call("Taco Bell");
    }).then(function(addressTwo) {
      console.log(addressTwo);
      console.log(accounts[2]);
      assert.equal(addressTwo, accounts[2], 'it returns correct address for registered name');
      return blockIdInstance.returnAddress("donkey");
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'it reverts for non registered name');
      return blockIdInstance.validId.call("donkey");
    }).then((result) => {
      assert.equal(result, false, 'validId() returns false for bad username')
      return blockIdInstance.validId.call("Taco Bell");
    }).then((result) => {
      assert.equal(result, true, 'validId() returns true for valid username');
    })
  })

  it('registers viewer allowance correctly', function() {
    return BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      return blockIdInstance.setAllow("invalid name" , {from: accounts[0] });
    }).then(assert.fail).catch(function(error){
      assert(error.message.indexOf('revert') >= 0, 'it doesn\'t allow invalid allow\'s');
      return blockIdInstance.setAllow("Taco Bell", { from: accounts[0] });
    }).then(function(receipt) {
      assert(receipt.logs.length, 1, 'triggers allowed event');
      assert(receipt.logs[0].event, 'Allowed', 'should be "Allowed" event');
      assert(receipt.logs[0].args._from, accounts[0], 'logs the account that gave allowance');
      assert(receipt.logs[0].args._to, accounts[2], 'lots the account which was allowed');
      return blockIdInstance.idAllowance(accounts[0], accounts[2]);
    }).then(function(success) {
      console.log(success);
      assert.equal(success, true, 'it correctly allows and returns true');
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
