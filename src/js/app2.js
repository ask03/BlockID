
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
      App.listenForAllowEvent();
      App.render();
    })
  },

  listenForAllowEvent: function() {
    var blockIdInstance;
    var addressArr = [];
    App.contracts.BlockID.deployed().then((instance) => {
      blockIdInstance = instance;
      return blockIdInstance.Allowed({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(error == null) {
          if(event.args._to == App.account) {
            console.log(event);
            addressArr.push(event.args._from);
            console.log(addressArr.length);

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

    var EthnicityEnum = {
      ASIAN: 1,
      CAUCASIAN: 2,
      BLACK: 3,
      LATINO: 4,
      PACIFICISLANDER: 5,
      properties: {
        1: {name: "Asian", value: 1},
        2: {name: "Caucasian", value: 2},
        3: {name: "Black", value: 3},
        4: {name: "Latino", value: 4},
        5: {name: "Pacific Islander", value: 5}
      }
    };

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

    var nameDiv = $('#nameDiv');
    var userNameDiv = $('#userNameDiv');
    var imgHolderDiv = $('#imgHolderDiv');
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
      userName = web3.toAscii(userNameBytes);
      console.log(userNameBytes);
      // info.append("<h6>" + userName + "</h6>");
      var insert = ""
      console.log(tmpId);
      imgHolderDiv.append(`<img src="https://ipfs.infura.io/ipfs/${tmpId[4]}" class="img-fluid"/>`)
      for(var i = 0; i < 3; i++) {
        insert = insert + tmpId[i] +"&nbsp;"
      }
      nameDiv.append("<p>" + insert + "</p>");
      insert = "<p>" + tmpId[3] + "</p>"
      nameDiv.append(insert);
      var bdayStr = String(tmpId[5]);
      var bdayMonth = bdayStr.slice(0,2);
      var bdayDay = bdayStr.slice(2,4);
      var bdayYear = bdayStr.slice(4,8);
      nameDiv.append("<p>" + bdayMonth + "/" + bdayDay + "/" + bdayYear + "</p>")
      nameDiv.append("<p>" + EthnicityEnum.properties[tmpId[6]].name + "</p>")
      if(tmpId[6] == true) {
        gendStr = "Male"
      } else {
        gendStr = "Female"
      }
      nameDiv.append("<p>" + gendStr + "</p>")
      userNameDiv.append("<p>&nbsp;&nbsp;"+userName+"</p>");
    })

    content.show();
    loader.hide();
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
