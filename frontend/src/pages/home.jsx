import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Add fade-in animation to the dynamic content
    const dynamicContent = document.querySelectorAll(".dynamic-content");
    dynamicContent.forEach((element) => {
      element.style.animation = "fade-in 2s";
    });
  }, []);

  return (
    <div style={containerStyle}>
      {/* Left Section */}
      <div style={leftStyle}>
        <div style={contentStyle}>
          <h1 className="dynamic-content" style={headingStyle}>Welcome to Cohyve Editor</h1>
          <p className="dynamic-content" style={paragraphStyle}>A MultiPlatform to edit and review</p>
          <button onClick={() => navigate("/editor")} style={buttonStyle}>
            Go to Editor
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div style={rightStyle}>
        <div style={dynamicContentStyle}>
          <h2 className="dynamic-content" style={dynamicHeadingStyle}>Why Choose Cohyve Editor?</h2>
          <ul style={dynamicTextStyle}>
            <li className="dynamic-content">Collaborate in real-time with your team.</li>
            <li className="dynamic-content">Drag-and-drop editor for effortless design.</li>
            <li className="dynamic-content">✨ Export high-quality designs with ease.</li>
            <li className="dynamic-content">✨ Leave comments, resolve feedback, and improve designs faster than ever.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Styles
const containerStyle = {
  display: "flex",
  height: "100vh", // Full height of the viewport
  margin: 0,
};

const leftStyle = {
  flex: 1, // Take up 50% of the page
  backgroundColor: "#1a1a1a", // Softer black
  color: "white",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const rightStyle = {
  flex: 1, // Take up 50% of the page
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const contentStyle = {
  textAlign: "center",
  padding: "20px",
  color: "white",
};

const headingStyle = {
  fontSize: "36px",
  marginBottom: "20px",
};

const paragraphStyle = {
  fontSize: "18px",
  marginBottom: "20px",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "10px 20px",
  fontSize: "18px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#28a745",
  color: "white",
  borderRadius: "5px",
  animation: "pulse 2s infinite",
};

const dynamicContentStyle = {
  textAlign: "left",
  padding: "20px",
  animation: "fade-in 3s", // Add dynamic fade-in effect
};

const dynamicHeadingStyle = {
  fontSize: "24px",
  marginBottom: "15px",
  color: "#007BFF", // Attractive blue color
};

const dynamicTextStyle = {
  fontSize: "18px",
  lineHeight: "1.6",
  color: "white",
  listStyleType: "none",
  padding: 0,
};

// Add animations via CSS (Include this in your CSS file or inject it globally)
const animations = `
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.9;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
`;

export default Home;

// Append the CSS animations to your document's <style> tag
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = animations;
document.head.appendChild(styleSheet);