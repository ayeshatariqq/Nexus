import React, { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "../../components/ui/Button";

interface SignaturePadProps {
  onSave?: (signatureData: string) => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clearSignature = () => {
    sigCanvas.current?.clear();
  };

  const saveSignature = () => {
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      onSave?.(dataURL);
    } else {
      alert("Please provide a signature before saving.");
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-lg font-semibold">Sign Below:</p>
      <div className="border-2 border-gray-300 rounded-lg">
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{
            width: 500,
            height: 200,
            className: "bg-white rounded-lg"
          }}
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={clearSignature}>
          Clear
        </Button>
        <Button onClick={saveSignature}>
          Save Signature
        </Button>
      </div>
    </div>
  );
};

export default SignaturePad;
