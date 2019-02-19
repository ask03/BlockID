pragma solidity ^0.5.0;

contract BlockID {

  address admin;

  struct Identification {
    string firstName;
    string middleName;
    string lastName;
    string nationality;
    string imgHash;
    uint dob;
    uint ethnicity;
    bool gender;
  }

  event Allowed(address _from, address _to);
  event Registered(address indexed _address);

  enum Ethnicity { Asian, Caucasian, Black, Latino, PacificIslander }
  /* enum IDClass { NotAllowed, Basic, General, Private } */
  mapping(address => Identification) public personalId;
  mapping(address => mapping(address => bool)) public idAllowance;
  mapping(bytes32 => address) public nameRegistry;
  mapping(address => bytes32) public addressToName;

  function createId(string memory _userName, string memory _firstName,
    string memory _middleName, string memory _lastName,
    string memory _nationality, string memory _imgHash,
    uint _dob, uint _ethnicity, bool _gender) public {

    require(registerName(_userName));
    Identification memory id = Identification(_firstName, _middleName,
       _lastName, _nationality, "", _dob, _ethnicity, _gender);
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

  function returnAddress(string memory _name) public view returns(address) {
    bytes32 name = stringToBytes32(_name);
    require(nameRegistry[name] != address(0));
    return nameRegistry[name];
  }

  function setAllow(string memory _name) public {
    bytes32 name = stringToBytes32(_name);
    require(nameRegistry[name] != address(0));
    address allow = nameRegistry[name];
    /* IDClass class = IDClass(_class); */
    idAllowance[msg.sender][allow] = true;
    emit Allowed(msg.sender, allow);
  }

  function requestId(address _idAddress) public {
    require(idAllowance[_idAddress][msg.sender]);
  }

  /* function bytes32ToString(bytes32 memory source) private pure returns (string result) {

  } */

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
