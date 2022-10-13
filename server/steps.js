const clients = require("./clients");
const products = require("./products");
const carrinho = require("./carrinho");
const response = require("./response");
const paymentMode = require("./paymentMode");

module.exports = {
  1: {
    name: "REGISTRO",
    handler: (server, body) => {
      console.log("Client register: " + body.name + "|" + body.email);
      if (clients[body.email]) {
        response.sendErrorResponse(server, "Cliente já registrado!");
        return;
      }
      clients[body.email] = {
        name: body.name,
        products: [],
        paymentMode: "",
        totalPrice: 0,
      };

      let message =
        "\nSeja bem vindo ao The Market! \nPor favor, escolha os produtos!\n\n";
      products.forEach((element) => {
        message =
          message + `${element.id} - ${element.name}  ${element.price} R$ \n`;
      });

      message =
        message +
        "\n\nPara adicionar os itens no carrinho digite o número e a quantidade. (ex: 1 5)";
      message =
        message +
        "\nPara remover os itens do carrinho digite rm, número e quantidade. (ex: rm 2 1)";
      message = message + "\nPara exibir os itens do carrinho digite cr.";
      message = message + "\nPara finalizar digite f.";

      response.sendSucessResponse(server, message, true);
    },
  },
  2: {
    name: "COMPRAS",
    handler: (server, body) => {
      const lineSplitted = body.line.split(" ");
      if (lineSplitted.length === 1) {
        const action = lineSplitted[0];
        if (action === "cr") {
          carrinho.show(body.client, server);
        }

        if (action === "f") {
          carrinho.finish(body.client, server);
        }
      }

      if (lineSplitted.length === 2) {
        const productId = lineSplitted[0];
        const quant = lineSplitted[1];
        if (productId !== NaN && quant !== NaN) {
          console.log(body);
          carrinho.add(productId, quant, body.client, server);
          return;
        }
        response.sendErrorResponse(
          server,
          "Ocorreu um erro ao adicionar os produtos ao carrinho"
        );
        return;
      }

      if (lineSplitted.length === 3) {
        const action = lineSplitted[0];
        const productId = lineSplitted[1];
        const quant = lineSplitted[2];
        if (action === "rm" && productId !== NaN && quant !== NaN) {
          carrinho.remove(productId, quant, body.client, server);
          return;
        }
        response.sendErrorResponse(
          server,
          "Ocorreu um erro ao remover o(s) produto(s) do carrinho"
        );
        return;
      }
    },
  },
  3: {
    name: "ENDEREÇO",
    handler: (server, body) => {
      clients[body.client].adress = body.line;
      message = "\nEscolha uma forma de pagamento:\n";
      paymentMode.forEach((payment) => {
        message = message + `${payment.id} - ${payment.mode}\n`;
      });

      message = message + "\nDigite o número da forma de pagamento";

      response.sendSucessResponse(server, message, true);
    },
  },
  4: {
    name: "PAGAMENTO",
    handler: (server, body) => {
      try {
        clients[body.client].paymentMode = body.line;
        const client = clients[body.client];

        message =
          message +
          `\n\nAgradecemos o seu pedido, ${client.name}. Seu pedido será enviado em 45min.`;

        response.sendSucessResponse(server, message, true);
      } catch (e) {
        response.sendErrorResponse(
          server,
          "Ocorreu um erro ao finalizar o pedido"
        );
      }
    },
  },
};
