import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

import { routes } from "./routes";
import { OrderBookService } from "./services/order-books";

const app = express();

app.set("trust proxy", true);
app.use(json());
app.use(cors());

routes(app);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", async (socket) => {
  OrderBookService.publishOrderbookEvent(socket);
  setInterval(() => {
    OrderBookService.publishOrderbookEvent(socket);
  }, 30000);
});

app.use("*", async (req, res) => {
  throw new Error("Not Found!");
});

export { server as app };
