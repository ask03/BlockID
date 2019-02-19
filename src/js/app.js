const Buffer = window.IpfsApi().Buffer

App = {

  ipfsInstance: null,
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  imgBuffer: null,

  init: function() {
    console.log("App initialized...")
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

    App.ipfsInstance = window.IpfsApi({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https'
    });

    web3.eth.getCoinbase(function(err, account) {
      if(err == null) {
        App.account = account;
          $('#accountAddress').html("Your Account: " + account);
        console.log(App.account);
      }
    });

    console.log(App.account);
    App.initContracts();
  },

  initContracts: function() {
    $.getJSON("BlockID.json", function(blockId) {
      App.contracts.BlockID = TruffleContract(blockId);
      App.contracts.BlockID.setProvider(App.web3Provider);
      App.contracts.BlockID.deployed().then(function(blockId) {
        console.log("BlockID Address:", blockId.address);
        App.loading = false;
      });
      console.log(App.account);
      App.listenForEvents();
      App.render();
    });


  },

  listenForEvents: function() {

    var blockIdInstance;
    App.contracts.BlockID.deployed().then(function(instance){
      blockIdInstance = instance;
      blockIdInstance.Registered({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        if(error == null) {
          console.log("event triggered", event);
          blockIdInstance.personalId(App.account)
          .then(function(tmpId){
            if(tmpId[0] !== "") {
              //fill in redirect
              console.log('wtf');
              window.location.href='index2.html'
            }
          })
        }
      })
    })

  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;
    console.log(App.account);
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    var bdayGroupYear = $('#bdayGroupYear');
    bdayGroupYear.empty();
    for(var i = 1900; i <= 2019; i++) {
      var dobYear = "<option value='" + i + "'>" + i + "</option>";
      bdayGroupYear.append(dobYear);
    }

    var bdayGroupDay = $('#bdayGroupDay');
    bdayGroupDay.empty();
    for(var i = 1; i <= 31; i++) {
      var dobDay = "<option value='" + i + "'>" + i + "</option>";
      bdayGroupDay.append(dobDay);
    }

    loader.hide();
    content.show();

  },

  loadImg: function(event) {
    console.log("capture and load img...");
    const file = event.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file)
    reader.onloadend = () =>{
      App.imgBuffer = Buffer(reader.result);
      console.log('buffer', App.imgBuffer);
    }
  },

  registerId: function(event) {
    // $('#content').hide();
    // $('#loader').show();

    var userName = $('#inputUserName').val();
    var firstName = $('#inputFirstName').val();
    var middleName = $('#inputMidName').val();
    var lastName = $('#inputLastName').val();
    var gender = $('#inputGender').val();
    var ethnicity = $('#inputEthnicity').val();
    var nationality = $('#inputNationality').val();
    var bdayYear = $('#bdayGroupYear').val();
    var bdayDay = $('#bdayGroupDay').val();
    var bdayMonth = $('#bdayGroupMonth').val();

    if ((bdayDay / 10) < 1) {
      bdayDay = 0 + bdayDay;
    }
    if ((bdayMonth /10) < 1) {
      bdayMonth = 0 + bdayMonth;
    }

    var dob = bdayMonth + bdayDay + bdayYear;

    App.ipfsInstance.files.add(App.imgBuffer, (err, result) => {
      if(err) {
        console.log(err)
        return;
      }
      console.log(result[0].hash);
      App.contracts.BlockID.deployed().then(function(instance) {
        return instance.createId(userName, firstName, middleName, lastName, nationality,
        result[0].hash, dob, ethnicity, gender, {
          from: App.account,
          gas: 500000
        });
      }).then(function(receipt) {
        if(receipt.receipt.status == 1) {
          alert("Registration Successful");
        } else {
          alert("Registration Failure");
        }
      })
    })
  }

}

$(function() {
  $(window).on('load', function() {
    App.init();
  })
});
