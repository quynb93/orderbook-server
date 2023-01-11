import { app } from "./app";

const start = async () => {
  app.listen(3000, "0.0.0.0", () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
