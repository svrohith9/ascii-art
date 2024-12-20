import React, { useState, useRef, useCallback } from "react";
import { Upload, Image as ImageIcon, Download } from "lucide-react";

const EMOJI_MAPPING = {
  dark: "😎",
  medium: "😊",
  light: "😇",
  veryLight: "👻",
};

export function ImageConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [emojiArt, setEmojiArt] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertToEmoji = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Scale down the image to make the emoji art more manageable
      const scale = Math.min(100 / img.width, 50 / img.height);
      canvas.width = Math.floor(img.width * scale);
      canvas.height = Math.floor(img.height * scale);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let emojiText = "";

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const brightness =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;

          if (brightness < 64) emojiText += EMOJI_MAPPING.dark;
          else if (brightness < 128) emojiText += EMOJI_MAPPING.medium;
          else if (brightness < 192) emojiText += EMOJI_MAPPING.light;
          else emojiText += EMOJI_MAPPING.veryLight;
        }
        emojiText += "\n";
      }

      setEmojiArt(emojiText);
    };
    img.src = image;
  }, [image]);

  const handleDownload = () => {
    if (!emojiArt) return;
    const blob = new Blob([emojiArt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emoji-art.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Image to Emoji Art Converter
        </h1>

        <div className="space-y-6">
          <div className="flex justify-center">
            <label className="flex flex-col items-center px-4 py-6 bg-gray-50 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
              <Upload className="w-12 h-12 mb-2" />
              <span className="text-sm">Upload an image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {image && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img
                  src={image}
                  alt="Uploaded preview"
                  className="max-h-64 rounded-lg shadow-md"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={convertToEmoji}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <ImageIcon className="w-5 h-5" />
                  Convert to Emoji Art
                </button>
              </div>
            </div>
          )}

          {emojiArt && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {emojiArt}
                </pre>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Emoji Art
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
