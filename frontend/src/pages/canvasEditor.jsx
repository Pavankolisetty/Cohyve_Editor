import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Text, Image, Transformer } from "react-konva";
import useImage from "use-image";
import API from "../api/api";
import io from "socket.io-client";
import axios from "axios";



const socket = io("http://localhost:5000");

function CanvasEditor() {
  const [designId, setDesignId] = useState("606c6b8e3f1d2c001d8a0f9c"); // Example design ID, replace with actual ID
  const [texts, setTexts] = useState([]);
  const [images, setImages] = useState([]);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTextId, setCurrentTextId] = useState(null);
  const [textValue, setTextValue] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [textProperties, setTextProperties] = useState({
    fontSize: 24,
    color: "black",
    align: "left",
    fontFamily: "Arial",
  });
  const [comments, setComments] = useState([]);
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentBoxPosition, setCommentBoxPosition] = useState({ x: 0, y: 0 });
  const [downloadCount, setDownloadCount] = useState(1); // State to keep track of download count

  const textInputRef = useRef(null);
  const stageRef = useRef(null);
  const transformerRef = useRef(null);

  useEffect(() => {
    socket.on("newComment", (newComment) => {
      setComments((prevComments) => [...prevComments, newComment]);
    });
  }, []);


  const markAsResolved = async () => {
    if (selectedComment) {
      try {
        const resolvedComment = { ...selectedComment, status: "resolved" };
        const response = await API.put(`/api/reviews/${designId}/comments/${resolvedComment.id}`, resolvedComment);
        socket.emit("resolveComment", resolvedComment);
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === resolvedComment.id ? resolvedComment : comment
          )
        );
        setIsCommenting(false);
      } catch (error) {
        console.error("Error marking comment as resolved:", error);
      }
    } else {
      console.error("No comment selected to mark as resolved.");
    }
  };

  const addComment = (text, x, y) => {
    const newComment = {
      id: `comment-${comments.length + 1}`,
      text,
      x,
      y,
      status: "pending", // Default status
    };
    setComments([...comments, newComment]);
  };

  const addText = () => {
    const newText = {
      id: `text-${texts.length + 1}`,
      x: 100,
      y: 100,
      text: "Your Text Here",
      fontSize: 24,
      fill: "black",
      align: "left",
      draggable: true,
    };
    setTexts([...texts, newText]);
  };

  const addImage = (url) => {
    const newImage = {
      id: `image-${images.length + 1}`,
      x: 150,
      y: 150,
      width: 150,
      height: 150,
      url: url,
      draggable: true,
    };
    setImages([...images, newImage]);
  };

  const handleImageTransform = ({ id, width, height }) => {
    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === id ? { ...image, width, height } : image
      )
    );
  };

  const handleDragEnd = (e, id, type) => {
    if (type === "text") {
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text.id === id ? { ...text, x: e.target.x(), y: e.target.y() } : text
        )
      );
    } else if (type === "image") {
      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === id ? { ...image, x: e.target.x(), y: e.target.y() } : image
        )
      );
    }
  };

  const handleTextClick = (text) => {
    setIsEditing(true);
    setCurrentTextId(text.id);
    setTextValue(text.text);
    setTextProperties({
      fontSize: text.fontSize,
      color: text.fill,
      align: text.align,
      fontFamily: text.fontFamily,
    });

    const stage = stageRef.current.getStage();
    const { x, y } = stage.getPointerPosition();
    textInputRef.current.style.left = `${x}px`;
    textInputRef.current.style.top = `${y - text.fontSize}px`;
    textInputRef.current.style.fontSize = `${text.fontSize}px`;
    textInputRef.current.style.display = "block";
    textInputRef.current.focus();
    setSelectedId({ id: text.id, type: "text" });
  };

  const handleInputChange = (e) => {
    setTextValue(e.target.value);
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === currentTextId ? { ...text, text: e.target.value } : text
      )
    );
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    textInputRef.current.style.display = "none";
  };

  const handleSelect = (id, type, x, y) => {
    setSelectedId({ id, type });
    setCommentBoxPosition({ x, y });
    setIsCommenting(true);
    const comment = comments.find((comment) => comment.id === id);
    setSelectedComment(comment);
  };

  const removeSelectedItem = () => {
    if (selectedId) {
      if (selectedId.type === "text") {
        setTexts((prevTexts) => prevTexts.filter((text) => text.id !== selectedId.id));
      } else if (selectedId.type === "image") {
        setImages((prevImages) => prevImages.filter((image) => image.id !== selectedId.id));
      }
      setSelectedId(null);
    }
  };

  const updateTextProperties = (prop, value) => {
    setTextProperties((prev) => ({ ...prev, [prop]: value }));
    setTexts((prevTexts) =>
      prevTexts.map((text) =>
        text.id === selectedId?.id ? { ...text, [prop]: value } : text
      )
    );
  };

  const handleCommentSubmit = async (commentData) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/reviews/${commentData.designId}`, {
        text: commentData.text,
        position: commentData.position,
      });
      console.log("Comment submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };
  
  

  const exportAsImage = (format) => {
    try {
      const uri = stageRef.current.toDataURL({ mimeType: `image/${format}`, quality: 1.0 });
      const link = document.createElement("a");
      link.download = `cohyvedesign${downloadCount}.${format}`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadCount(downloadCount + 1); // Increment download count
    } catch (error) {
      console.error("Failed to export canvas content:", error);
      alert("Failed to export canvas content. Please try again.");
    }
  };

  useEffect(() => {
    if (selectedId?.type === "image") {
      const node = stageRef.current.findOne(`#${selectedId.id}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer().batchDraw();
    }
  }, [selectedId]);

  return (
    <div style={parentContainerStyle}>
      <div style={sidebarStyle}>
        <h3>Text Properties</h3>
        {selectedId?.type === "text" && (
          <>
            <label style={labelStyle}>Font Family:</label>
            <select
              value={textProperties.fontFamily}
              onChange={(e) => updateTextProperties("fontFamily", e.target.value)}
              style={selectStyle}
            >
              <option value="Arial">Arial</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Tahoma">Tahoma</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Verdana">Verdana</option>
              <option value="Comic Sans MS">Comic Sans MS</option>
              <option value="Impact">Impact</option>
              <option value="Trebuchet MS">Trebuchet MS</option>
              <option value="Lucida Console">Lucida Console</option>
              <option value="Palatino Linotype">Palatino Linotype</option>
              <option value="Segoe UI">Segoe UI</option>
              <option value="Roboto">Roboto</option>
            </select>

            <label style={labelStyle}>Font Size:</label>
            <input
              type="number"
              value={textProperties.fontSize}
              onChange={(e) => updateTextProperties("fontSize", Number(e.target.value))}
              style={inputStyle}
            />

            <label style={labelStyle}>Font Color:</label>
            <input
              type="color"
              value={textProperties.color}
              onChange={(e) => updateTextProperties("fill", e.target.value)}
              style={{
                marginBottom: "10px",
                padding: "6px",
                borderRadius: "10px",
                border: "1px solid #ccc",
                cursor: "pointer",
                height: "40px",
                width: "200px",
              }}
            />

            <label style={labelStyle}>Alignment:</label>
            <select
              value={textProperties.align}
              onChange={(e) => updateTextProperties("align", e.target.value)}
              style={selectStyle}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </>
        )}
      </div>

      <div>
        <h2>Canvas Editor</h2>
        {!isCanvasLoaded && <p>Loading Canvas...</p>}
        <button onClick={addText} style={buttonStyle}>
          Add Text
        </button>
        <button onClick={() => addImage("https://images.pexels.com/photos/1054655/pexels-photo-1054655.jpeg?cs=srgb&dl=pexels-hsapir-1054655.jpg&fm=jpg")} style={buttonStyle}>
          Add Image
        </button>
        <button onClick={removeSelectedItem} style={buttonStyle}>
          Remove Selected Item
        </button>
        <button onClick={() => exportAsImage("png")} style={buttonStyle}>
          Export as PNG
        </button>
        <button onClick={() => exportAsImage("jpeg")} style={buttonStyle}>
          Export as JPEG
        </button>
        <Stage
          width={1160}
          height={800}
          style={canvasStyle}
          ref={stageRef}
        >
<Layer>
  {texts.map((text) => (
    <Text
      key={text.id}
      x={text.x}
      y={text.y}
      text={text.text}
      fontSize={text.fontSize}
      fill={text.fill}
      align={text.align}
      fontFamily={text.fontFamily}
      draggable={text.draggable}
      onDragEnd={(e) => handleDragEnd(e, text.id, "text")}
      onClick={() => handleTextClick(text)}
      onTap={(e) => handleSelect(text.id, "text", e.target.x(), e.target.y())}
      onDblTap={() => handleTextClick(text)}
    />
  ))}
  {images.map((image) => (
    <URLImage
      key={image.id}
      image={image}
      onDragEnd={(e) => handleDragEnd(e, image.id, "image")}
      onTransformEnd={handleImageTransform}
      onTap={(id, type, x, y) => handleSelect(id, type, x, y)}
      onClick={(id, type, x, y) => handleSelect(id, type, x, y)}
    />
  ))}
  {comments.map((comment) => (
    <Text
      key={comment.id}
      x={comment.x}
      y={comment.y}
      text={comment.text}
      fontSize={16}
      fill="#333333" // Updated color to match the editor's theme
      opacity={0.1} // Reduced opacity to make it less visible
      draggable={false} // Comments are static markers
    />
  ))}
  <Transformer ref={transformerRef} />
</Layer>
        </Stage>
        <input
          ref={textInputRef}
          value={textValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          style={{
            position: "absolute",
            display: "none",
            border: "none",
            background: "none",
            outline: "none",
            fontSize: "24px",
            color: "red",
          }}
        />
{isCommenting && (
  <div style={{ ...commentBoxStyle, left: commentBoxPosition.x, top: commentBoxPosition.y }}>
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="Leave your comment here..."
      style={textareaStyle}
    />
    <button onClick={handleCommentSubmit} style={buttonStyle}>Submit</button>
    <button onClick={markAsResolved} style={buttonStyle}>Mark as Resolved</button> {/* New Button */}
  </div>
)}
      </div>
    </div>
  );
}




const parentContainerStyle = {
  display: "flex",
  gap: "20px",
  padding: "10px",
};

const sidebarStyle = {
  width: "250px",
  padding: "15px",
  borderRight: "2px solid #ccc",
  fontFamily: "Arial, sans-serif",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const labelStyle = {
  fontWeight: "bold",
  marginBottom: "5px",
};

const inputStyle = {
  marginBottom: "10px",
  padding: "5px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const selectStyle = {
  marginBottom: "10px",
  padding: "5px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  margin: "10px",
  padding: "10px 20px",
  fontSize: "16px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#007BFF",
  color: "white",
  borderRadius: "5px",
};

const canvasStyle = {
  border: "2px solid white",
  display: "block",
  margin: "auto",
};

const commentBoxStyle = {
  position: "absolute",
  background: "white",
  border: "1px solid #ccc",
  padding: "10px",
  borderRadius: "5px",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
};

const textareaStyle = {
  width: "200px",
  height: "100px",
  marginBottom: "10px",
  padding: "5px",
  fontSize: "14px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  resize: "none",
};

const URLImage = ({ image, onDragEnd, onTransformEnd, onClick, onTap }) => {
  const [img] = useImage(image.url, "Anonymous"); // Add "Anonymous" for cross-origin

  return (
    <Image
      image={img}
      x={image.x}
      y={image.y}
      width={image.width}
      height={image.height}
      draggable
      id={image.id}
      onClick={(e) => {
        onClick(image.id, "image", e.target.x(), e.target.y());
      }}
      onTap={(e) => {
        onTap(image.id, "image", e.target.x(), e.target.y());
      }}
      onDragEnd={onDragEnd}
      onTransformEnd={(e) => {
        onTransformEnd({
          id: image.id,
          width: e.target.width(),
          height: e.target.height(),
        });
      }}
    />
  );
};

export default CanvasEditor;