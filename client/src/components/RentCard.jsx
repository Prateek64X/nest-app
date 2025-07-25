import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import '@/styles/components.css';
import { FaCheck, FaHome, FaBolt, FaWallet } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";
import EditElectricityModal from './EditElectricityModal';
import MarkPaidModal from './MarkPaidModal';

export default function RentCard({rentData, roomData}) {
    const [expanded, SetExpanded] = useState(false);
    const [paid, SetPaid] = useState(rentData.paidCost === rentData.totalCost);

    return(
        <>
            <Card className="p-4 relative">
                <Accordion type="single" collapsible value={expanded} onValueChange={SetExpanded}>
                    <AccordionItem value="rentcard-1">
                        <AccordionTrigger className="py-0 text-left">
                            <CollapsedRentContent rentData={rentData} paid={paid} expanded={expanded} />
                        </AccordionTrigger>

                        <AccordionContent className="pt-0 pb-2">
                            <ExpandedRentContent rentData={rentData} roomData={roomData} paid={paid} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </Card>
        </>
    );
}

function CollapsedRentContent({rentData, paid, expanded}) {
    return (
        <div className="flex items-start gap-4 w-full">
            <img
                className="w-12 h-12 rounded-full object-cover"
                src={rentData.photoUrl}
                alt="Tenant Photo"
            />

            <div className="flex flex-col flex-1">
                {/* Top Row */}
                <div className="flex justify-between items-center">
                    <h2 className="text-base font-medium">{rentData.fullName}</h2>
                    <span className='text-sm text-muted-foreground'>{rentData.floor} - {rentData.room}</span>
                </div>

                {/* Bottom Row */}
                {!expanded ? 
                (
                    <div className="flex items-center">
                        <span className='text-base font-medium text-primary'>₹ {rentData.totalCost}</span>
                        {paid && <FaCheck className='w-3 h-3 text-green-600 ml-2' />}
                    </div>
                ) : (
                    <span className="text-xs text-muted-foreground my-2">
                    Cost Breakdown
                    </span>
                )}
            </div>
        </div>
    );
}

function ExpandedRentContent({rentData, roomData, paid}) {
    const [roomCost, setRoomCost] = useState(rentData?.roomCost || 0);
    const [electricityCost, setElectricityCost] = useState(rentData?.electricityCost || 0);
    const [maintenanceCost, setMaintenanceCost] = useState(rentData?.maintenanceCost || 0);
    const [showElectricityModal, setShowElectricityModal] = useState(false);
    const [showMarkPaidModal, setShowMarkPaidModal] = useState(false);

    return(
        <div className='pl-16 mr-8'>
            <div className='max-w-full w-full'>
                <div className="grid grid-cols-[max-content_auto] items-center gap-y-2">
                    <LabelRow 
                        icon={<FaHome className="mr-1 text-muted-foreground" />}
                        label="Room Rent"
                        value={roomCost.toString() || ''}
                        handleValueChange={setRoomCost}
                    />
                    <LabelRow 
                        icon={<FaBolt className="mr-1 text-muted-foreground" />}
                        label="Electricity Cost"
                        value={electricityCost.toString() || ''}
                        onClick={() => setShowElectricityModal(true)}
                    />
                    <LabelRow 
                        icon={<MdWaterDrop className="mr-1 text-muted-foreground" />}
                        label="Maintainance Cost"
                        value={maintenanceCost.toString() || ''}
                        handleValueChange={setMaintenanceCost}
                    />
                    <LabelRow
                        icon={<FaWallet className="mr-1 text-foreground" />}
                        label={"Total Cost"}
                        value={rentData.totalCost}
                        labelClassName="text-sm text-foreground"
                        isTick={paid}
                    />
                    {(!paid && rentData.paidCost !== 0) && 
                        (<LabelRow
                            icon={<FaWallet className="mr-1 text-muted-foreground" />}
                            label={"Cost Paid"}
                            value={rentData.paidCost}
                            isTick={paid}
                        />)
                    }
                
                </div>
            </div>
            {paid && <FaCheck className="relative right-8 bottom-4 -mb-2 w-3 h-3 text-green-600 ml-2" />}
            <Button className="w-full mt-4" onClick={() => {setShowMarkPaidModal(true)}}>{paid ? "Edit Payment" : "Mark as Paid"}</Button>

            {/* Dialog to open edit electricity modal */}
            {showElectricityModal && (
                <EditElectricityModal 
                    onClose={() => setShowElectricityModal(false)} 
                    handleElectricityCostChange={(newCost) => {setElectricityCost(newCost); setShowElectricityModal(false);}} 
                    roomData={roomData}
                />
            )}
            {showMarkPaidModal && (
                <MarkPaidModal 
                    onClose={() => setShowMarkPaidModal(false)} 
                    handlePaymentChange={() => {setShowMarkPaidModal(false);}} 
                    rentData={rentData} 
                />
            )}
        </div>
    );
}

// Row to display Rent Type and Cost in Table
function LabelRow({icon, label, symbol="₹", value, onClick, handleValueChange, labelClassName="text-sm text-muted-foreground", isTick}) {
    return(
        <>
            <div className="flex items-center gap-1">
                <span className="text-muted-foreground shrink-0">{icon}</span>
                <span className={labelClassName}>{label}</span>
            </div>

            <div className="flex items-center justify-end shrink-0 ml-2">
            {symbol && <span className="relative left-2 text-sm text-foreground">{symbol}</span>}
            {onClick ? (
                <button 
                    onClick={onClick} 
                    className={"bg-transparent text-sm text-right text-foreground w-20 truncate border-0 border-b border-input " +
                        "hover:bg-accent hover:text-primary focus:outline-none"}
                >
                    {value}
                </button>
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => handleValueChange?.(e.target.value)}
                    className={"bg-transparent text-sm text-right w-20 truncate border-0 border-b border-input " +
                        (handleValueChange
                        ? "focus:outline-none focus:border-primary cursor-text"
                        : "cursor-default text-muted-foreground")
                    }
                />
            )}
            </div>
        </>
    );
}