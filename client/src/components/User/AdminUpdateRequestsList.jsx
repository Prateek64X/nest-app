import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FaBell, FaExclamationTriangle } from "react-icons/fa";
import UpdateRequestCard from "./UpdateRequestCard";
import { useUpdateRequests } from "@/hooks/useUpdateRequests";

export default function AdminUpdateRequestsPopover({ user }) {
  const [requests, refresh] = useUpdateRequests(user?.id);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="absolute top-4 right-4 z-30 flex items-center px-2 py-2 rounded-full"
        >
          <FaBell className="w-5 h-5 text-muted-foreground" />
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-primary rounded-full">
              {requests.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-[340px] p-3 space-y-2 max-h-[60vh] overflow-y-auto shadow-xl border border-border rounded-xl
             bg-card/10 backdrop-blur-sm"
      >
        <div className="flex justify-between">
          <h2 className="text-md font-semibold text-primary tracking-tight ml-2">
            Update Requests
          </h2>
        </div>

        {requests.length === 0 && (
          <div className="text-muted-foreground text-sm flex items-center gap-2">
            <FaExclamationTriangle className="text-yellow-500" />
            No update requests
          </div>
        )}

        {requests.map((req) => (
          <UpdateRequestCard
            key={req.id}
            request={req}
            onDismiss={refresh}
            isAdmin={true}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
