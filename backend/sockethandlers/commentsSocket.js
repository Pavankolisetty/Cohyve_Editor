const Comment = require("../models/Comment");

const handleAddComment = (socket) => {
  socket.on("addComment", async (data) => {
    try {
      const newComment = new Comment(data);
      await newComment.save();

      // Emit the new comment to all connected clients
      socket.broadcast.emit("newComment", newComment);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });
};

const handleResolveComment = (socket) => {
  socket.on("resolveComment", async (data) => {
    try {
      const resolvedComment = await Comment.findByIdAndUpdate(data.id, { status: "resolved" }, { new: true });
      socket.broadcast.emit("resolveComment", resolvedComment);
    } catch (error) {
      console.error("Error resolving comment:", error);
    }
  });
};

module.exports = { handleAddComment, handleResolveComment };