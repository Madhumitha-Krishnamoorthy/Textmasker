import React, { useState } from "react";
import axios from "axios";
import './App.css';


const App = () => {
  const [searchText, setSearchText] = useState("");
  const [maskChar, setMaskChar] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/search`, {
        params: { text: searchText },
      });
      setFiles(response.data.files);
      setMessage(response.data.files.length === 0 ? "No file found with entered search criteria." : "");
    } catch (error) {
      console.error("Error during search:", error);
    }
  };

  const handleMask = async () => {
    try {
      await axios.post("http://localhost:5000/mask", {
        files: selectedFiles,
        searchText,
        maskChar,
      });
      setShowConfirm(false);
      setMessage("Changes have been saved successfully.");
      setSelectedFiles([]);
      setFiles([]);
    } catch (error) {
      console.error("Error during masking:", error);
    }
  };

  const toggleFileSelection = (fileName) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileName)
        ? prevSelected.filter((f) => f !== fileName)
        : [...prevSelected, fileName]
    );
  };

  return (
    <div className="container">
      <h2>Text Finder and Masking Tool</h2>
      <input
        type="text"
        placeholder="Search text..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {message && <p>{message}</p>}

      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <input
              type="checkbox"
              checked={selectedFiles.includes(file.name)}
              onChange={() => toggleFileSelection(file.name)}
            />
            {file.name} - Count: {file.count}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Mask with character"
        value={maskChar}
        onChange={(e) => setMaskChar(e.target.value)}
      />
      <button onClick={() => setShowConfirm(true)}>Submit</button>

      {showConfirm && (
        <div className="modal">
          <p>
            Are you sure to mask the searched text "{searchText}" with "{maskChar}"?
          </p>
          <button onClick={handleMask}>Yes</button>
          <button onClick={() => setShowConfirm(false)}>No</button>
        </div>
      )}
    </div>
  );
};

export default App;
