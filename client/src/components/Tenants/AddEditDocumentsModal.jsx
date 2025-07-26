import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FaEye,
  FaFileContract,
  FaFileSignature,
  FaIdCard,
  FaPassport,
  FaTrash,
  FaUpload,
} from 'react-icons/fa';
import { MdOutlineAdd } from 'react-icons/md';
import Modal from '../shared/Modal';

const documentsLabelList = [
  { key: 'doc_aadhar', label: 'Aadhar', icon: <FaIdCard /> },
  { key: 'doc_pan', label: 'PAN', icon: <FaIdCard /> },
  { key: 'doc_voter', label: 'Voter ID', icon: <FaIdCard /> },
  { key: 'doc_license', label: 'License', icon: <FaFileSignature /> },
  { key: 'doc_police', label: 'Police Verification', icon: <FaPassport /> },
  { key: 'doc_agreement', label: 'Rent Agreement', icon: <FaFileContract /> },
];

export default function AddEditDocumentsModal({ onClose, onSave, existingDocuments = {} }) {
  const [documents, setDocuments] = useState(
    Object.entries(existingDocuments).filter(([_, url]) => url && url.trim() !== '').map(([type, url]) => ({ type, url }))
  );
  const [newFile, setNewFile] = useState(null);
  const [newDocType, setNewDocType] = useState('');

  const selectedTypes = documents.map((doc) => doc.type);
  const availableTypes = documentsLabelList.filter((d) => !selectedTypes.includes(d.key));

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setNewFile({ file, url });
  };

  const handleAddDocument = () => {
    if (newFile && newDocType) {
      setDocuments((prev) => [...prev, { type: newDocType, url: newFile.url }]);
      setNewFile(null);
      setNewDocType('');
    }
  };

  const handleDelete = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const result = documents.reduce((acc, doc) => {
      acc[doc.type] = doc.url;
      return acc;
    }, {});
    onSave(result);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <div className="w-[340px] space-y-5">
        <h2 className="text-lg font-semibold text-foreground">Add Documents</h2>

        {/* Uploaded Documents List */}
        <div className="space-y-2">
          {documents.map((doc, index) => {
            const meta = documentsLabelList.find((d) => d.key === doc.type);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  {meta?.icon}
                  {meta?.label || doc.type}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <FaEye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(index)}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Document Section */}
        {documents.length < documentsLabelList.length && (
          <>
            {newFile ? (
              <div className="space-y-2">
                <Label>Select Document Type</Label>
                <Select value={newDocType} onValueChange={setNewDocType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {availableTypes.map((doc) => (
                      <SelectItem
                        key={doc.key}
                        value={doc.key}
                        className="data-[highlighted]:bg-secondary data-[highlighted]:text-foreground"
                      >
                        <div className="flex items-center gap-2">
                          {doc.icon}
                          {doc.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  className="w-full mt-2"
                  onClick={handleAddDocument}
                  disabled={!newDocType}
                >
                  <MdOutlineAdd /> Add selected
                </Button>
              </div>
            ) : (
              <div>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload">
                  <div className="h-25 border-2 border-dashed border-muted p-4 text-muted-foreground flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer hover:bg-muted/20 transition">
                    <FaUpload className="mb-1 w-5 h-5" />
                    Add Document
                  </div>
                </label>
              </div>
            )}
          </>
        )}

        {/* Footer Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
    </Modal>
  );
}
