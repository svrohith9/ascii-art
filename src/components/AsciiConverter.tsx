import React, { useState, useRef, useCallback } from "react";
import { Upload, Image as ImageIcon, Copy, Check } from "lucide-react";
import { ASCII_CHARS, calculateAspectRatio } from "../utils/imageProcessing";
import { OutputSettings } from "./OutputSettings";
import { AsciiOutput } from "./AsciiOutput";

export function AsciiConverter() {
  const [image, setImage] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string>("");
  const [outputWidth, setOutputWidth] = useState<number>(100);
  const [charSet, setCharSet] = useState<"detailed" | "simple">("detailed");
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

  const getCharacterSet = (brightness: number): string => {
    const chars =
      charSet === "detailed"
        ? ASCII_CHARS
        : { dark: "@", medium: "%", light: "-", veryLight: "." };

    if (brightness < 64)
      return chars.dark[Math.floor(Math.random() * chars.dark.length)];
    if (brightness < 128)
      return chars.medium[Math.floor(Math.random() * chars.medium.length)];
    if (brightness < 192)
      return chars.light[Math.floor(Math.random() * chars.light.length)];
    return chars.veryLight[Math.floor(Math.random() * chars.veryLight.length)];
  };

  const convertToAscii = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const dimensions = calculateAspectRatio(
        img.width,
        img.height,
        outputWidth
      );
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let asciiText = "";

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const brightness =
            (imageData.data[i] +
              imageData.data[i + 1] +
              imageData.data[i + 2]) /
            3;
          asciiText += getCharacterSet(brightness);
        }
        asciiText += "\n";
      }

      setAsciiArt(asciiText);
    };
    img.src = image;
  }, [image, outputWidth, charSet]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Image to ASCII Art Converter
        </h1>

        <div className="space-y-6">
          <div className="flex justify-center">
            <label className="flex flex-col items-center px-8 py-8 bg-gray-50 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors border-2 border-dashed border-gray-300">
              <Upload className="w-12 h-12 mb-2" />
              <span className="text-sm font-medium">Upload an image</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG up to 10MB
              </span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {image && (
            <>
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="relative group">
                    <img
                      src={image}
                      alt="Uploaded preview"
                      className="max-h-64 rounded-lg shadow-md transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => setImage(null)}
                        className="text-white text-sm bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                </div>
                <OutputSettings
                  outputWidth={outputWidth}
                  setOutputWidth={setOutputWidth}
                  charSet={charSet}
                  setCharSet={setCharSet}
                />
                <div className="flex justify-center">
                  <button
                    onClick={convertToAscii}
                    className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                  >
                    <ImageIcon className="w-5 h-5" />
                    Convert to ASCII Art
                  </button>
                </div>
              </div>
            </>
          )}

          {asciiArt && <AsciiOutput asciiArt={asciiArt} />}
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
