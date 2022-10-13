module.exports = {
  sendSucessResponse(server, message, advance) {
    server.write(
      JSON.stringify({
        status: "OK",
        message: message,
        advance: advance,
      })
    );
  },

  sendErrorResponse(server, message) {
    server.write(
      JSON.stringify({
        status: "ERROR",
        message: message,
      })
    );
  },
};
