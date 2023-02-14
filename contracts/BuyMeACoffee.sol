//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.0;

// Deployed to Goerli at 0xD1460658A1D73D9b09D668eAa6669E7A469Ed95a

contract BuyMeACoffee {

    // Evento para registrar cuando se compra un cafe
    event newMemo(
        address buyer,
        uint256 timeStamp,
        string name,
        string message
    );

    // Estructura memo: para guardar información sobre las compras
    struct Memo {
        address buyer;
        uint256 timestamp;
        string name;
        string message;
    }

    /* La direccion de la persona que hace deploy del contrato
    Es payable para poder pasar tod0 el dinero a esa direccion */
    address payable owner;

    // Lista con todas las compras
    Memo[] memos;

    // Constructor del contrato
    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev funcion para comprar un cafe
     * @param _name nombre del comprador
     * @param _message mensaje de la compra
     */ 
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value >= 0, "Can't buy a coffee with 0 eth");

        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit newMemo(msg.sender, block.timestamp, _name, _message);
    }   
    
    /**
     * @dev funcion para pasar tod0 el dinero del contrato a la billetera del owner
     */ 
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev devuelve la lista de memos
     */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }
    
}