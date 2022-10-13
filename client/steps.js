const rl = require("./readline");
const clientInfo = require("./clientInfo");

module.exports = {
  1: {
    name: "REGISTRO",
    handler: (client, stepNumber, name) => {
      clientInfo.name = name;

      rl.question("Digite o seu email:\n", (response) => {
        clientInfo.email = response;
        const request = JSON.stringify({
          step: stepNumber,
          body: {
            name: name,
            email: response,
          },
        });
        client.write(request);
      });
    },
  },
  2: {
    name: "COMPRAS",
    handler: (client, stepNumber, line) => {
      client.write(
        JSON.stringify({
          step: stepNumber,
          body: {
            client: clientInfo.email,
            line: line,
          },
        })
      );
    },
  },
  3: {
    name: "ENDEREÇO",
    handler: (client, stepNumber, line) => {
      client.write(
        JSON.stringify({
          step: stepNumber,
          body: {
            client: clientInfo.email,
            line: line,
          },
        })
      );
    },
  },
  4: {
    name: "PAGAMAENTO",
    handler: (client, stepNumber, line) => {
      client.write(
        JSON.stringify({
          step: stepNumber,
          body: {
            client: clientInfo.email,
            line: line,
          },
        })
      );
    },
  },
};
