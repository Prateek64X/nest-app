import { useRef, useState } from "react";
import { MdEdit } from "react-icons/md";
import { Pencil } from "lucide-react";

export default function ProfileImageInput({ value, onChange }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(value || '');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Avatar wrapper (does NOT clip) */}
      <div className="relative w-24 h-24">
        {/* Inner clipped circle */}
        <div className="group w-full h-full rounded-full bg-secondary overflow-hidden relative">
          {/* Image or fallback */}
          {preview ? (
            <img
              src={preview}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs bg-muted rounded-full">
              No Image
            </div>
          )}

          {/* Center hover/click overlay for desktop */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/10 group-hover:bg-black/40 transition"
          >
            <Pencil className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Hidden input */}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Top-right floating edit icon (always visible) */}
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
