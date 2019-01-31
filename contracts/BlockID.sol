pragma solidity ^0.5.0;

contract BlockID {

  address admin;

  struct Identification {
    string firstName;
    string lastName;
    string middleName;
    string gender;
    string nationality;
    string citizenship;
    uint ssn;
    uint dob;
  }

  event Allowed(address _from, address _to, IDClass _class);

  enum IDClass { NotAllowed, Basic, General, Private }
  mapping(address => Identification) public personalId;
  mapping(address => mapping(address => IDClass)) public idAllowance;
  mapping(bytes32 => address) public nameRegistry;

  function createId(string memory _firstName, string memory _gender) public {
    Identification memory id = Identification(_firstName,"","", _gender, "","", 0, 0);
    personalId[msg.sender] = id;

  }

  function registerName(string memory _name) public returns(bool success) {
    bytes32 name = stringToBytes32(_name);
    require(nameRegistry[name] == address(0x0));
    nameRegistry[name] = msg.sender;
    /* registeredAddress[msg.sender] = true; */
    return true;
  }

  function returnAddress(string memory _name) public view returns(address) {
    bytes32 name = stringToBytes32(_name);
    require(nameRegistry[name] != address(0));
    return nameRegistry[name];
  }

  function setAllow(string memory _name, uint _class) public {
    bytes32 name = stringToBytes32(_name);
    address allow = nameRegistry[name];
    IDClass class = IDClass(_class);
    idAllowance[msg.sender][allow] = class;
    emit Allowed(msg.sender, allow, class);
  }

  function requestId(address _idAddress) public {
    require(idAllowance[_idAddress][msg.sender] != IDClass.NotAllowed);
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
