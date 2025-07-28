import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { Pencil } from "lucide-react";

export default function ProfileImageInput({ value, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!value) {
      setPreview('');
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(value);
    } else if (typeof value === 'string') {
      setPreview(value);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative w-24 h-24">
        <div className="group w-full h-full rounded-full bg-secondary overflow-hidden relative">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs bg-muted rounded-full">
              No Image
            </div>
          )}

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/10 group-hover:bg-black/40 transition"
          >
            <Pencil className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="absolute top-0 right-0 p-1 bg-secondary rounded-full shadow z-20"
        >
          <MdEdit className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <p className="text-sm text-muted-foreground">Profile Image</p>
    </div>
  );
}
