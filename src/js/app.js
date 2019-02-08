App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,

  init: function() {
    console.log("App initialized...")
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("BlockID.json", function(blockId) {
      App.contracts.BlockID = TruffleContract(blockId);
      App.contracts.BlockID.setProvider(App.web3Provider);
      App.contracts.BlockID.deployed().then(function(blockId) {
        console.log("BlockID Address:", blockId.address);
      });
      return App.render();

    });
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

    var bdayGroupYear = $('#bdayGroupYear');
    bdayGroupYear.empty();
    for(var i = 1900; i <= 2019; i++) {
      var dobYear = "<option value='" + i + "'>" + i + "</option>";
      bdayGroupYear.append(dobYear);
    }

  },

  registerId: function() {
    $('#content').hide();
    $('#loader').show();

    // var
  }

}

$(function() {
  $(window).on('load', function() {
    App.init();
  })
});
