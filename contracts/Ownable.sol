pragma solidity ^0.8.10;

import '@openzeppelin/contracts/access/AccessControl.sol';

abstract contract Ownable is AccessControl {
  address private _owner;

  bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

  event OwnershipTransferred(
    address indexed previousOwner,
    address indexed newOwner
  );


  constructor() {
        _owner = msg.sender;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }


  function owner() public view returns(address) {
    return _owner;
  }


  modifier onlyOwner() {
    require(isOwner(), "Is not owner");
    _;
  }

  modifier ownerOrMinter() {
    require(hasRole(MINTER_ROLE, msg.sender) || isOwner(), "Caller is not the minter or owner");
    _;
  }


  function isOwner() public view returns(bool) {
    return msg.sender == _owner;
  }


  function renounceOwnership() public onlyOwner {
    emit OwnershipTransferred(_owner, address(0));
    _owner = address(0);
  }


  function transferOwnership(address newOwner) public onlyOwner {
    _transferOwnership(newOwner);
  }


  function _transferOwnership(address newOwner) internal {
    require(newOwner != address(0));
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }
}