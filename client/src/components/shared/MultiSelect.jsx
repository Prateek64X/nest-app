import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

export default function MultiSelectDropdown({ options = [], selected = [], onChange }) {
  const toggle = (id) => {
    const updated = selected.includes(id)
      ? selected.filter((v) => v !== id)
      : [...selected, id];
    onChange(updated);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected.length > 0 ? `${selected.length} selected` : "Select Room(s)"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-85 max-h-[250px] overflow-y-auto p-2 space-y-2">
        {options.map((room) => (
          <button
            key={room.id}
            type="button"
            onClick={() => toggle(room.id)}
            className="flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md hover:bg-muted"
          >
            <Checkbox checked={selected.includes(room.id)} readOnly />
            <span className="text-sm">{room.name}</span>
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}