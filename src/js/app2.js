
App = {

  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,

  ethnicity:{
      1: {name: "Asian", value: 1},
      2: {name: "Caucasian", value: 2},
      3: {name: "Black", value: 3},
      4: {name: "Latino", value: 4},
      5: {name: "Pacific Islander", value: 5},
  },

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
    var userName;
    App.contracts.BlockID.deployed().then((instance) => {
      blockIdInstance = instance;
      return blockIdInstance.Allowed({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(error == null) {
          if(event.args._to == App.account) {
            console.log(event);
            blockIdInstance.addressToName(event.args._from).then((usernameBytes) => {
              userName = web3.toAscii(usernameBytes);
              $('#list-tab').append(`<a class="list-group-item list-group-item-action" id="${userName}list" data-toggle="list"
              href="#list-${userName}" role="tab" aria-controls="${userName}" onClick="App.loadImgForView(this);">${userName}</a>`)

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
      nameDiv.append("<p>" + App.ethnicity[tmpId[6]].name + "</p>")
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

  loadImgForView: function(event) {

    var imgDiv = $('#tabContent-imgDiv');
    var idList = $('#tabContent-idList');
    imgDiv.empty();
    var userName = $(event).html();
    console.log(userName);
    var imgHash;
    var blockIdInstance;
    App.contracts.BlockID.deployed().then((instance) => {
      blockIdInstance = instance;
      return blockIdInstance.returnAddress(userName);
    }).then((address) => {
      return blockIdInstance.personalId(address);
    }).then((tmpId) => {
      var firstName = tmpId[0];
      var midName = tmpId[1];
      var lastName = tmpId[2];
      var fullName = `${firstName} ${midName} ${lastName}`;
      var nationality = tmpId[3];
      var imgHash = tmpId[4];
      var dob = App.makeDob(tmpId[5]);
      var ethnicity = App.ethnicity[tmpId[6]].name;
      var gender = App.getGender(tmpId[7]);

      idList.empty();
      idList.append(`<p>${fullName}</p>`);
      idList.append(`<p>${nationality}</p>`)
      idList.append(`<p>${dob}</p>`);
      idList.append(`<p>${ethnicity}`);
      idList.append(`<p>${gender}`);
      imgDiv.append(`<img src="https://ipfs.infura.io/ipfs/${imgHash}" class="img-fluid"/>`)

    })



  },

  makeDob: function(dob) {

    var rawString = String(dob);
    var dobMonth = rawString.slice(0,2);
    var dobDay = rawString.slice(2,4);
    var dobYear = rawString.slice(4,8);

    var dobString = `${dobMonth}/${dobDay}/${dobYear}`;
    return dobString;

  },

  getGender: function(gender) {

    if(gender == true) {
      return "Male"
    }
    return "Female"

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
