import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaHome } from "react-icons/fa";
import { cn } from "@/lib/utils";

export default function Navbar({ navigationRoutes = [] }) {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-2 left-0 right-0 z-20 px-4">
            <div className="mx-auto w-full max-w-sm flex justify-between items-center bg-background/20 backdrop-blur-sm shadow-md rounded-xl p-1.5 gap-2">
                {navigationRoutes.map((nav, index) => {
                    const isSelected = location.pathname === nav.path;

                    return (
                        <Button
                            key={index}
                            variant={isSelected ? "default" : "ghost"}
                            onClick={() => navigate(nav.path)}
                            className={cn("flex-1 flex flex-col items-center justify-center gap-0 px-2 py-2 rounded-lg h-auto",
                                isSelected ? "bg-primary text-white" : "text-black hover:bg-muted"
                            )}
                        >
                            <nav.icon.type className="!w-4.5 !h-4.5" />
                            <div className="text-[10px] font-medium">{nav.label}</div>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
