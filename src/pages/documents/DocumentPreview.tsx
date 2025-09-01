import React, { useMemo, useEffect } from "react";

type Props = {
  file: File | null;
};

const DocumentPreview: React.FC<Props> = ({ file }) => {
  // Only create an object URL if we actually have a file
  const objectUrl = useMemo(() => {
    return file ? URL.createObjectURL(file) : null;
  }, [file]);

  useEffect(() => {
    // Clean up when component unmounts or file changes
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  if (!file) {
    return <div>No file selected</div>;
  }

  return (
    <div className="border rounded-lg">
    <iframe
      src={objectUrl || ""}
      title="Document Preview"
      className="w-full min-h-[500px] border rounded-lg"
    />
    </div>
  );
};

export default DocumentPreview;
