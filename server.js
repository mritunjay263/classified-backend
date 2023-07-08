import express from "express";
import { APP_PORT, NODE_ENV } from "./config";
import db from "./models";
import path from "path";
import { errorHandler } from "./middlewares";
import cors from "cors";

import { createServer } from "http";
import { Server } from "socket.io";
import { chat_messages as ChatMessages } from "./models";

const app = express();

// if (NODE_ENV === "production") {
//   console.log = function () {};
// }

const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
  cors:{
    origin:'*',
    methods:['GET','POST']
  }
});


import {
  userRoutes,
  categoryRoutes,
  listingRoutes,
  advertismentRoutes,
  discussionRoutes,
  groupsRoute,
} from "./routes";

//cores settings
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"),
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With,Content-Type,Accept,Authorization"
    );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

/** initialised database here */
db.sequelize.authenticate().then(()=>{
  console.log("Database Connection has been established successfully.");
}).catch(e=>{
  console.error("Unable to connect to the database:", e);
})

global.appRoot = path.resolve(__dirname);

/** json parser enabled */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", (req, res, next) => {
  return res.status(200).json({
    stateCode: 200,
    msg: "Welcome to classified !",
  });
});

/** project routes */
app.use("/api", [
  userRoutes,
  categoryRoutes,
  listingRoutes,
  advertismentRoutes,
  discussionRoutes,
  groupsRoute
]);

const socketNamespace = io.of("/api/socket");

//wildcard route
app.use("/api/*", (req,res,next)=>{
  return res.status(404).json({
    stateCode:404,
    msg:'Requested Route Does not exist !'
  })
});

/** socket server is here */
socketNamespace.on("connection", (socket) => {
  // ...
  console.log("New Client connect with socketId: " + socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  socket.on("leave-room", (room) => {
    socket.leave(room);
    console.log(`User left room ${room}`);
  });

  socket.on("chat-message", async (msg, room, user) => {
    //save message in db
    let postDataPayload = {
      room_id: room,
      sender_id: user.id,
      message: msg,
    };
    postDataPayload = JSON.parse(JSON.stringify(postDataPayload));
    try {
      // Save message to the database
      const postDataRes = await ChatMessages.create(postDataPayload);
      // Broadcast the message to other clients
      socketNamespace.to(room).emit("chat-message", postDataRes);
      console.log(`Message: ${msg} sent to room ${room}`);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  /**disconnected */
  socket.on("disconnect", (reason) => {
    // ...
    console.log("disconnect " + reason);
  });
});




/** start project */
// app.listen(APP_PORT, () => {
//   console.log(`Listing on port : ${APP_PORT} (${process.env.NODE_ENV})`);
// });
/** use at last for middelware */
app.use(errorHandler);

/** socket server start*/
httpServer.listen(APP_PORT, () => {
  console.log(`Listing on port : ${APP_PORT} (${process.env.NODE_ENV})`);
});
