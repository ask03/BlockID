
App = {
  //app state values
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  //initialize application
  init: function() {
    console.log("App2 initialized...")
    App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    App.initContracts();
  },

  initContracts: function() {
    $.getJSON("BlockID.json", function(blockId) {
      App.contracts.BlockID = TruffleContract(blockId);
      App.contracts.BlockID.setProvider(App.web3Provider);
      App.contracts.BlockID.deployed().then(function(blockId) {
        App.deployedInstance = blockId;
        console.log("BlockID Address:", blockId.address);
      })
      App.listenForAllowEvent();
      App.render();
    })
  },

  listenForAllowEvent: function() {
    var blockIdInstance;
    var userName;
    App.contracts.BlockID.deployed().then((instance) => {
      blockIdInstance = instance;
      return blockIdInstance.Allowed({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(error == null) {
          if(event.args._to == App.account) {
            blockIdInstance.addressToName(event.args._from).then((usernameBytes) => {
              View.appendViewableId(web3.toAscii(usernameBytes));
            })
          }
        }
      })
    })

  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if(err == null) {
        App.account = account;
          $('#accountAddress').html("Your Account: " + account);
      }
    })

    var blockIdInstance;
    var userNameBytes;
    var str;
    var userName;
    App.contracts.BlockID.deployed().then(function(blockId) {
      blockIdInstance = blockId;
      return blockId.addressToName(App.account);
    }).then(function(bytes) {
      userNameBytes = bytes;
      return blockIdInstance.personalId(App.account);
    }).then(function(tmpId) {
      var id = Tools.formatId(tmpId);
      View.populateIdPane(id, web3.toAscii(userNameBytes));
      blockIdInstance.deposits(App.account).then((balance) => {
          var theBalance = web3.fromWei(balance.toNumber(), 'ether');
          $('#ethBalance').append(theBalance , " Ether");
      })
      // $('#ethBalance').append(web3.fromWei(blockIdInstance.deposits(App.account),'ether'));
    })
    content.show();
    loader.hide();
  },

  loadImgForView: function(event) {

    var userName = $(event).html();
    console.log(userName);
    var blockIdInstance;
    App.contracts.BlockID.deployed().then((instance) => {
      blockIdInstance = instance;
      return blockIdInstance.returnAddress(userName);
    }).then((address) => {
      return blockIdInstance.personalId(address);
    }).then((tmpId) => {
      var formattedId = Tools.formatId(tmpId);
      View.populateIdModal(formattedId);
    })

  },

  depositFunds: function() {
    var blockIdInstance;
    var amount = web3.toWei($('#depositInput').val());
    App.contracts.BlockID.deployed().then((instance) => {
      blockIdInstance = instance;
      return blockIdInstance.deposit({
        from: App.account,
        value: amount,
        gas: 500000
      });
    }).then((receipt) => {
      if(receipt.receipt.status == 1) {
        alert("deposit successful");
        $('#depositModal').modal('hide');
        $('#depositInput').val("");
        App.render();
      } else {
        alert("deposit failure");
        $('#depositModal').modal('hide');
        $('#depositInput').val("");
      }
    })

  },

  allowViewer: function() {

    var userName = $('#allowUsername').val();
    console.log(userName);

    var blockIdInstance;
    App.contracts.BlockID.deployed().then(function(instance) {
      blockIdInstance = instance;
      return blockIdInstance.validId.call(userName)
    }).then(function(success) {
      if(success) {
        blockIdInstance.setAllow(userName, {from: App.account}).then((receipt) => {
          if(receipt.receipt.status == 1) {
            $('#allowModal').modal('hide');
            alert(`Allowed "${userName}" successfully.`)
          } else {
            alert(`"${userName}" does not exist.`)
          }
        });
      } else {
        alert(`"${userName}" does not exist. Check username and try again.`)
      }
    })
  }

}

$(function() {
  $(window).on('load', function() {
    App.init();
  })
});
