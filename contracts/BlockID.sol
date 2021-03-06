pragma solidity ^0.5.0;

contract BlockID {

  address admin;

  struct Identification {
    string firstName;
    string lastName;
    string nationality;
    string imgHash; //IPFS hash string img
    string dob;
    uint ethnicity;
    bool gender;
  }

  event Allowed(address indexed _from, address indexed _to);
  event Registered(address indexed _address);

  enum Ethnicity { Asian, Caucasian, Black, Latino, PacificIslander }
  /* enum IDClass { NotAllowed, Basic, General, Private } */
  mapping(address => Identification) public personalId;
  mapping(address => mapping(address => bool)) public idAllowance;
  mapping(bytes32 => address) public nameRegistry;
  mapping(address => bytes32) public addressToName;
  mapping(address => uint) public deposits;

  /* contract is payable with deposits from users */
  function() external payable {
    deposits[msg.sender] += msg.value;
  }

  function createId(string memory _userName, string memory _firstName,
     string memory _lastName, string memory _nationality, string memory _imgHash,
    string memory _dob, uint _ethnicity, bool _gender) public {

    require(registerName(_userName));
    Identification memory id = Identification(_firstName,
    _lastName, _nationality, _imgHash, _dob, _ethnicity, _gender);
    personalId[msg.sender] = id;

    emit Registered(msg.sender);
  }

  function registerName(string memory _name) public returns(bool success) {
    bytes32 name = stringToBytes32(_name);
    require(nameRegistry[name] == address(0));
    require(addressToName[msg.sender] == 0);
    nameRegistry[name] = msg.sender;
    addressToName[msg.sender] = name;
    /* registeredAddress[msg.sender] = true; */
    return true;
  }

  function returnAddress(string memory _userName) public view returns(address) {
    require(validId(_userName));
    return nameRegistry[stringToBytes32(_userName)];
  }

  function setAllow(string memory _userName) public {
    bytes32 userName = stringToBytes32(_userName);
    require(nameRegistry[userName] != address(0));
    address allowAddress = nameRegistry[userName];
    idAllowance[msg.sender][allowAddress] = true;
    emit Allowed(msg.sender, allowAddress);
  }

  function requestId(address _idAddress) public view {
    require(idAllowance[_idAddress][msg.sender]);
  }

  function validId(string memory _userName) public view returns(bool) {
    bytes32 userName = stringToBytes32(_userName);
    if(nameRegistry[userName] == address(0) ||
    addressToName[nameRegistry[userName]] != userName) {
      return false;
    }

    return true;
  }

  function deposit() external payable {
    deposits[msg.sender] += msg.value;
  }

  function transferFunds(address _to, uint _value) public {
    require(deposits[msg.sender] >= _value);
    deposits[_to] += _value;
    deposits[msg.sender] -= _value;
  }

  function withdraw() external {
    require(deposits[msg.sender] >= 0);
    msg.sender.transfer(deposits[msg.sender]);
    deposits[msg.sender] -= deposits[msg.sender];
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
        return 0x0;
    }

    assembly {
      result := mload(add(source, 32))
    }
}

}
