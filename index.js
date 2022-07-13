const app = require("./app");

const port = process.env.PORT || 3000;

// start the server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = app;
