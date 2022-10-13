const clients = require("./clients");
const products = require("./products");
const response = require("./response");

itensMessage = (client) => {
  message = "\nITEM\t\tQUANTIDADE\t\tPREÇO\n";
  clients[client].products.forEach((element) => {
    message =
      message +
      `${element.name}\t\t${element.quant}\t\t\tR$ ${element.price}\n`;
  });
  message = message + `\nTOTAL: R$ ${clients.totalPrice}`;
  return message;
};

module.exports = {
  add(id, quant, client, server) {
    try {
      const product = products[Number(id) - 1];
      clients[client].products.push({
        ...products[Number(id) - 1],
        quant: quant,
      });
      const totalPrice = clients[client].products.reduce(
        (acc, item, index) => acc + item.price * item.quant,
        0
      );
      clients.totalPrice = totalPrice;
      response.sendSucessResponse(
        server,
        `${quant} ${product.name}(s) adicionado(s) ao carrinho`,
        false
      );
    } catch (e) {
      response.sendErrorResponse(server, "Erro ao adicionar produtos");
    }
  },
  remove(id, quant, client, server) {
    try {
      const product = products[Number(id) - 1];

      for (let i = 0; i < clients[client].products.length; i++) {
        if (clients[client].products[i].id == id)
          clients[client].products[i].quant -= quant;

        if (clients[client].products[i].quant == 0)
          clients[client].products.splice(i, 1);
      }

      const totalPrice = clients[client].products.reduce(
        (acc, item, index) => acc + item.price * item.quant,
        0
      );
      clients.totalPrice = totalPrice;

      response.sendSucessResponse(
        server,
        `${quant} ${product.name}(s) removido(s) do carrinho`,
        false
      );
    } catch (e) {
      response.sendErrorResponse(server, "Erro ao remover o produto");
    }
  },
  show: (client, server) => {
    try {
      if (clients[client].products.length !== 0) {
        message = itensMessage(client);
        response.sendSucessResponse(server, message, false);
        return;
      }
      response.sendSucessResponse(server, `O carrinho está vazio`, false);
    } catch (e) {
      response.sendErrorResponse(server, "Erro ao mostrar o carrinho");
    }
  },
  finish: (client, server) => {
    if (clients[client].products.length !== 0) {
      message = itensMessage(client);

      message = message + "\n\nPor favor, informe o seu endereço:\n";
      response.sendSucessResponse(server, message, true);
      return;
    }
    response.sendSucessResponse(server, `O carrinho está vazio`, false);
  },
};
