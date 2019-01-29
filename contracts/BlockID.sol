pragma solidity ^0.5.0;

contract BlockID {

  address admin;
  uint registryId;

  struct Identification {
    string name;
    string gender;
    string nationality;
    uint ssn;
    uint dob;
  }

  mapping(address => Identification) public personalId;
  mapping(address => mapping(address => int)) idViewAllowance;
  mapping(bytes32 => address) public nameRegistry;

  function createId(string memory _name, string memory _gender) public {
    Identification memory id = Identification(_name, _gender, "", 0, 0);
    personalId[msg.sender] = id;

  }

  function registerName(string memory _name) public returns(bool success) {
    bytes32 name = stringToBytes32(_name);
    require(nameRegistry[name] == address(0x0));
    nameRegistry[name] = msg.sender;
    return true;
  }

  function returnAddress(string memory _name) public view returns(address) {
      bytes32 name = stringToBytes32(_name);

      return nameRegistry[name];
  }

  /* function allowViewName(string memory _name) public {

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
