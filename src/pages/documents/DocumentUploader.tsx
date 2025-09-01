import React, { useRef, useState } from "react";
import {Button} from "../../components/ui/Button";


export type AcceptString = string;

interface DocumentUploaderProps {
  onUpload: (file: File) => void;
  onClear?: () => void;
  accept?: AcceptString;
  maxSizeMB?: number;
  className?: string;
}


const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onUpload,
  onClear,
  accept = "application/pdf,.pdf,.doc,.docx",
  maxSizeMB = 10,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const reset = () => {
    setFile(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    onClear?.();
  };

  const prettySize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const isTypeAllowed = (f: File) => {
    // Quick checks by MIME & extension
    const lowerName = f.name.toLowerCase();
    const allowed = accept.split(",").map((s) => s.trim().toLowerCase());

    const byExt = allowed.some((a) => a.startsWith(".") && lowerName.endsWith(a));
    const byMime = allowed.some((a) => !a.startsWith(".") && f.type.toLowerCase() === a);

    // Fallback: allow common Word MIME even if not exact match
    const commonDocxMime =
      f.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    const commonDocMime = f.type === "application/msword";

    return byExt || byMime || commonDocxMime || commonDocMime;
  };

  const validateFile = (f: File): string | null => {
    if (!isTypeAllowed(f)) {
      return "Unsupported file type. Please upload a PDF or Word document (.doc/.docx).";
    }
    const sizeLimit = maxSizeMB * 1024 * 1024;
    if (f.size > sizeLimit) {
      return `File is too large. Max allowed is ${maxSizeMB} MB.`;
    }
    return null;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    const err = validateFile(f);
    if (err) {
      setError(err);
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
    onUpload(f);
  };

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    handleFiles(e.target.files);
  };

  const onDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave: React.DragEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="text-center space-y-2">
          <div className="font-semibold">Drag & drop your file here</div>
          <div className="text-sm text-gray-600">or</div>
          <Button onClick={openFileDialog} variant="outline">
            Browse files
          </Button>
          <div className="text-xs text-gray-500 mt-2">
            Accepted: PDF, DOC, DOCX · Max {maxSizeMB} MB
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* Feedback */}
      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
          {error}
        </div>
      )}

      {/* Selected file */}
      {file && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border p-4 bg-white">
          <div className="min-w-0">
            <div className="font-medium truncate">{file.name}</div>
            <div className="text-xs text-gray-500">{prettySize(file.size)}</div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={openFileDialog}>
              Replace
            </Button>
            <Button variant="outline" onClick={reset}>
              Clear
            </Button>
          </div>
        </div>
      )}
  
    </div>
  );
};

export default DocumentUploader;
