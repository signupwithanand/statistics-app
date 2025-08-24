import React, { useRef } from 'react';
import { Upload, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface FileUploadProps {
  onDataLoaded: (data: number[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        const numbers: number[] = [];
        
        for (const line of lines) {
          const values = line.split(',').map(val => val.trim());
          for (const val of values) {
            const num = parseFloat(val);
            if (!isNaN(num) && num >= -1000 && num <= 1000) {
              numbers.push(num);
            }
          }
        }
        
        if (numbers.length > 0) {
          onDataLoaded(numbers);
        } else {
          alert('No valid numbers found in the file. Please ensure your CSV contains numeric values.');
        }
      } catch (error) {
        alert('Error reading file. Please ensure it\'s a valid CSV file.');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.txt"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload CSV file"
      />
      
      <motion.div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
        onClick={triggerFileUpload}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600 mb-1">Click to upload CSV file</p>
        <p className="text-xs text-gray-500">Supports .csv and .txt files</p>
      </motion.div>

      <div className="bg-blue-50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">CSV Format:</p>
            <p>Each number on a new line or comma-separated:</p>
            <code className="block mt-1 text-xs bg-white px-2 py-1 rounded">
              10, 15, 20<br />
              25<br />
              30, 35
            </code>
          </div>
        </div>
      </div>
    </div>
  );
};