const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");
const http = require("http");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

const designRoutes = require("./routes/designRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

app.use("/api/designs", designRoutes);
app.use("/api/reviews", reviewRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/api/data", (req, res) => {
  res.json({ message: "API is working!" });
});

const { handleResolveComment, handleAddComment } = require("./sockethandlers/commentsSocket");

io.on('connection', (socket) => {
  console.log('A user connected');

  handleResolveComment(socket);
  handleAddComment(socket);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});