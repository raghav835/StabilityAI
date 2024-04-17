import { useState } from 'react';
import './index.css'; // Import CSS file

function TextToImageConverter() {
  const [text, setText] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading indicator

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const convertToImage = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await query({ "inputs": text });
      setImageSrc(URL.createObjectURL(response));
    } catch (error) {
      console.error('Error converting text to image:', error);
    } finally {
      setLoading(false); // Set loading state to false when conversion is done (whether successful or not)
    }
  };

  const handleDownload = () => {
    if (imageSrc) {
      const link = document.createElement('a');
      link.href = imageSrc;
      link.download = 'converted_image.png'; // Set desired filename here
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  }

  return (
    <div className="container">
      <h1>Text to Image Converter</h1>
      <textarea
        className="text-input"
        placeholder="Enter your text here..."
        value={text}
        onChange={handleChange}
      />
      <div className="button-container">
        <button className="convert-btn" onClick={convertToImage} disabled={loading}>
          {loading ? 'Converting...' : 'Convert to Image'}
        </button>
        {imageSrc && (
          <button className="download-btn" onClick={handleDownload}>
            Download Image
          </button>
        )}
      </div>
      {imageSrc && <img src={imageSrc} alt="Converted Image" />}
      <footer className="footer">© 2024 Text to Image Converter</footer>
    </div>
  );
}

export default TextToImageConverter;
