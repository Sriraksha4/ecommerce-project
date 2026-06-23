import { useState } from "react";
import API from "../services/api";

function AITools() {

  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");

  const generateDescription = async () => {

    try {

      const res = await API.post(
        "/ai/generate-description",
        { productName }
      );

      setDescription(res.data.description);

    } catch (error) {
      alert("AI Generation Failed");
    }
  };

  return (
    <div>

      <h1>AI Product Description Generator</h1>

      <input
        className="input-box"
        placeholder="Enter Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />

      <button
        className="generate-btn"
        onClick={generateDescription}
      >
        Generate Description
      </button>

      <textarea
        rows="10"
        value={description}
        readOnly
      />

    </div>
  );
}

export default AITools;