const net = require("net");
const steps = require("./steps");
const rl = require("./readline");

const client = new net.Socket();

handleResponse = (response) => {
  if (response.status === "OK") {
    if (response.message) {
      console.log(response.message);
    }

    if (response.advance) {
      return 1;
    }
    return 0;
  }

  if (response.status === "ERROR") {
    console.log(
      "Ocorreu um erro, por favor verifique as instruções novamente."
    );
    console.log(response.message);
    return 0;
  }
};

client.connect(4000, () => {
  let stepNumber = 1;

  client.on("data", (data) => {
    const advance = handleResponse(JSON.parse(data.toString()), stepNumber);
    stepNumber = stepNumber + advance;
  });

  rl.addListener("line", (line) => {
    steps[stepNumber].handler(client, stepNumber, line);
  });
});
