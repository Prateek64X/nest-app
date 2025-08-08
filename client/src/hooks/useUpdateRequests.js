// hooks/useUpdateRequests.js
import { getAllUpdateRequests } from "@/services/updateRequestService";
import { useEffect, useState } from "react";

export function useUpdateRequests(userId) {
  const [requests, setRequests] = useState([]);

  async function fetchRequests() {
    try {
      const data = await getAllUpdateRequests(userId);
      console.log("Fetched Requests:", data); // Debugging log
      setRequests(data);
    } catch (err) {
      console.error("Request Fetch Error:", err);
    }
  }

  useEffect(() => {
    if (userId) fetchRequests();
  }, [userId]);

  return [requests, fetchRequests];
}
