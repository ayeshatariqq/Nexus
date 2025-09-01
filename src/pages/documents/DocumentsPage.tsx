import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import DocumentUploader from './DocumentUploader';
import DocumentPreview from "./DocumentPreview";
import SignaturePad from "./SignaturePad";
import DocumentStatus, { Status } from "./DocumentStatus";

type Document = {
  id: number;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  status: Status;
};

const initialDocuments: Document[] = [
  { id: 1, name: 'Pitch Deck 2024.pdf', type: 'PDF', size: '2.4 MB', lastModified: '2024-02-15', shared: true, status: "Signed" },
  { id: 2, name: 'Financial Projections.xlsx', type: 'Spreadsheet', size: '1.8 MB', lastModified: '2024-02-10', shared: false, status: "In Review" },
  { id: 3, name: 'Business Plan.docx', type: 'Document', size: '3.2 MB', lastModified: '2024-02-05', shared: true, status: "Draft" },
  { id: 4, name: 'Market Research.pdf', type: 'PDF', size: '5.1 MB', lastModified: '2024-01-28', shared: false, status: "Draft" }
];

export const DocumentsPage: React.FC = () => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const handleStatusChange = (id: number, newStatus: Status) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, status: newStatus } : doc
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600">Manage your startup's important files</p>
        </div>
        <Button leftIcon={<Upload size={18} />} onClick={() => setIsUploadOpen(true)}>
          Upload Document
        </Button>
      </div>

      {/* Upload modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl my-10">

            <h2 className="text-lg font-semibold mb-4">Upload Document</h2>
            
            <DocumentUploader 
              onUpload={(file) => setUploadedFile(file)} 
              onClear={() => setUploadedFile(null)} 
            />

            {uploadedFile && (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Preview</h3>
                  <DocumentPreview file={uploadedFile} />
                </div>

                <SignaturePad onSave={(sig) => setSignature(sig)} />
                {signature && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Your Signature:</p>
                    <img src={signature} alt="Saved signature" className="border rounded-lg max-h-32" />
                  </div>
                )}
              </div>
            )}

            {/* Modal actions */}
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  if (uploadedFile) {
                    setDocuments(prev => [
                      ...prev,
                      {
                        id: prev.length + 1,
                        name: uploadedFile.name,
                        type: uploadedFile.type || "Unknown",
                        size: `${(uploadedFile.size / 1024 / 1024).toFixed(2)} MB`,
                        lastModified: new Date().toISOString().split("T")[0],
                        shared: false,
                        status: "Draft"
                      }
                    ]);
                  }
                  setIsUploadOpen(false);
                  setUploadedFile(null);
                  setSignature(null);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Storage info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">Storage</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Used</span>
                <span className="font-medium text-gray-900">12.5 GB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-primary-600 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Available</span>
                <span className="font-medium text-gray-900">7.5 GB</span>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quick Access</h3>
              <div className="space-y-2">
                {["Recent Files","Shared with Me","Starred","Trash"].map(item=>(
                  <button key={item} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Document list */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">All Documents</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Sort by</Button>
                <Button variant="outline" size="sm">Filter</Button>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-2">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                    <div className="p-2 bg-primary-50 rounded-lg mr-4">
                      <FileText size={24} className="text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{doc.name}</h3>
                        {doc.shared && <Badge variant="secondary" size="sm">Shared</Badge>}
                        <DocumentStatus initialStatus={doc.status} onStatusChange={(s)=>handleStatusChange(doc.id,s)} />
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>Modified {doc.lastModified}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm" className="p-2" aria-label="Download"><Download size={18} /></Button>
                      <Button variant="ghost" size="sm" className="p-2" aria-label="Share"><Share2 size={18} /></Button>
                      <Button variant="ghost" size="sm" className="p-2 text-error-600 hover:text-error-700" aria-label="Delete"><Trash2 size={18} /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
export default DocumentsPage;
