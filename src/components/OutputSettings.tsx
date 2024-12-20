import React from "react";
import { Settings, Sliders } from "lucide-react";

interface OutputSettingsProps {
  outputWidth: number;
  setOutputWidth: (width: number) => void;
  charSet: "detailed" | "simple";
  setCharSet: (set: "detailed" | "simple") => void;
}

export function OutputSettings({
  outputWidth,
  setOutputWidth,
  charSet,
  setCharSet,
}: OutputSettingsProps) {
  return (
    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-700">Output Settings</h3>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Output Width
            </label>
            <span className="text-sm text-gray-500">
              {outputWidth} characters
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-gray-400" />
            <input
              type="range"
              min="50"
              max="200"
              value={outputWidth}
              onChange={(e) => setOutputWidth(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Character Set
          </label>
          <select
            value={charSet}
            onChange={(e) =>
              setCharSet(e.target.value as "detailed" | "simple")
            }
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="detailed">Detailed (@#8&WM$%0?*+=;:,-...)</option>
            <option value="simple">Simple (@%-.)</option>
          </select>
        </div>
      </div>
    </div>
  );
}
