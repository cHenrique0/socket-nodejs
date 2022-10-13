const net = require("net");
const steps = require("./steps");

const handleConnection = (socket) => {
  socket.write(
    JSON.stringify({
      status: "OK",
      message: "Olá seja bem vindo ao The Market \nDigite o seu nome: ",
      advance: false,
    })
  );

  socket.on("end", () => {
    console.log("Desconectou");
  });

  socket.on("data", (data) => {
    const text = data.toString();
    console.log("Receiving data from client: " + text);
    const request = JSON.parse(text);
    steps[request.step].handler(socket, request.body);
  });
};

const server = net.createServer(handleConnection);
server.listen(4000, "127.0.0.1");
