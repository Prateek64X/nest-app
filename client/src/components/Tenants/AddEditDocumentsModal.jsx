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
  { key: 'docAadhar', label: 'Aadhar', icon: <FaIdCard /> },
  { key: 'docPan', label: 'PAN', icon: <FaIdCard /> },
  { key: 'docVoter', label: 'Voter ID', icon: <FaIdCard /> },
  { key: 'docLicense', label: 'License', icon: <FaFileSignature /> },
  { key: 'docPolice', label: 'Police Verification', icon: <FaPassport /> },
  { key: 'docAgreement', label: 'Rent Agreement', icon: <FaFileContract /> },
];

export default function AddEditDocumentsModal({ onClose, onSave, existingDocuments = {} }) {
  const documentKeys = documentsLabelList.map(doc => doc.key);

  const [tenantDocuments, setTenantDocuments] = useState(
    Object.fromEntries(
      documentKeys.map((key) => [key, { 
        file: existingDocuments[key]?.file || null, 
        url: existingDocuments[key]?.url || '' 
      }])
    )
  );

  const [newFile, setNewFile] = useState(null);
  const [newDocType, setNewDocType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setNewFile({ file, url });
  };

  const handleAddDocument = () => {
    if (!newDocType || !newFile?.file) return;

    setTenantDocuments((prev) => ({
      ...prev,
      [newDocType]: { file: newFile.file, url: '' },
    }));

    setNewDocType('');
    setNewFile(null);
  };

  const handleDelete = (key) => {
    setTenantDocuments((prev) => ({
      ...prev,
      [key]: { file: null, url: '' },
    }));
  };

  const handleSave = () => {
    onSave(tenantDocuments);
    onClose();
  };

  const usedKeys = Object.entries(tenantDocuments)
    .filter(([_, val]) => val.file || val.url)
    .map(([key]) => key);

  const availableTypes = documentsLabelList.filter(d => !usedKeys.includes(d.key));

  return (
    <Modal onClose={onClose}>
      <div className="w-[340px] space-y-5">
        <h2 className="text-lg font-semibold text-foreground">Add Documents</h2>

        {/* Document Previews */}
        <div className="space-y-2">
          {documentsLabelList.map(({ key, label, icon }) => {
            const doc = tenantDocuments[key];
            if (!doc.file && !doc.url) return null;

            return (
              <div key={key} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {icon} {label}
                </div>
                <div className="flex gap-2">
                  {(doc.file || doc.url) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        window.open(doc.file ? URL.createObjectURL(doc.file) : doc.url, '_blank')
                      }
                    >
                      <FaEye className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(key)}
                  >
                    <FaTrash className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add New Document */}
        {availableTypes.length > 0 && (
          <>
            {newFile ? (
              <div className="space-y-2">
                <Label>Select Document Type</Label>
                <Select value={newDocType} onValueChange={setNewDocType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {availableTypes.map(({ key, label, icon }) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className="data-[highlighted]:bg-secondary data-[highlighted]:text-foreground"
                      >
                        <div className="flex items-center gap-2">{icon} {label}</div>
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

        {/* Footer */}
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