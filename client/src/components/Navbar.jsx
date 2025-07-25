import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar({ navigationRoutes = [] }) {
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-2 left-0 right-0 z-20 px-4">
            <div className="mx-auto w-full max-w-sm flex justify-between items-center bg-background shadow-md rounded-xl p-2 gap-2">
                {navigationRoutes.map((nav, index) => {
                    const isSelected = location.pathname === nav.path;

                    return (
                        <Button
                            key={index}
                            variant={isSelected ? "default" : "ghost"}
                            onClick={() => navigate(nav.path)}
                            className={`flex-1 h-full flex flex-col items-center gap-0 justify-center rounded-lg
                                ${isSelected ? "bg-primary text-white" : "text-black hover:bg-muted"}`
                            }
                        >
                            <div className="text-xl">{nav.icon}</div>
                            <div className="text-[10px] font-medium">{nav.label}</div>
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
