import { ExternalLink, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function DocumentViewer({ url, open, onClose }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      // Small delay so transitions can play
      setTimeout(() => setShow(true), 10);
    } else {
      setShow(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-40 flex items-center justify-center transition-colors duration-300 ${
        show ? "bg-black/50" : "bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        className={`flex flex-col w-[90vw] max-w-4xl h-[80%] rounded-lg overflow-hidden bg-white/70 backdrop-blur-sm shadow-lg transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex justify-end gap-2 p-2 border-b bg-card">
          <Button
            variant="secondary"
            onClick={() => window.open(url, "_blank")}
            className="p-2 rounded-lg bg-accent hover:bg-secondary-highlight"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            onClick={onClose}
            className="p-2 rounded-lg bg-accent hover:bg-destructive hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Document */}
        <iframe
          src={url}
          title="Document Viewer"
          className="flex-1 w-full border-0"
        />
      </div>
    </div>
  );
}
