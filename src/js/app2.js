App = {

  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

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
        console.log("BlockID Address:", blockId.address);
      })
      App.render();
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
    // content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if(err == null) {
        App.account = account;
          $('#accountAddress').html("Your Account: " + account);
      }
    })

    var info = $('#info');
    App.contracts.BlockID.deployed().then(function(blockId) {
      return blockId.personalId(App.account);
    }).then(function(tmpId) {
      // var firstName = tmpId[0];
      // var middleName = tmpId[1];
      // var lastName = tmpId[2];
      // var nationality = tmpId[3];
      // var dob = tmpId[4];
      // var ethnicity = tmpId[5];
      // var gender = tmpId[6];
      for(var i = 0; i < 7; i++) {
        var insert = "<p>" + tmpId[i] + "</p> <br/>";
        info.append(insert);
      }

    })

  }



}

$(function() {
  $(window).on('load', function() {
    App.init();
  })
});
