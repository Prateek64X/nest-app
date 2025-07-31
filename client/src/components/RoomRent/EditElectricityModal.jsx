import React, { useEffect, useState } from 'react';
import Modal from '../shared/Modal';
import { Label } from "@/components/ui/label"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { truncateNumber } from '../../lib/utils.js';

export default function EditElectricityModal({
  prevElectricityUnits,
  electricityUnits,
  onClose,
  onChange
}) {
  const [unitCost, setUnitCost] = useState(8);
  const [lastMonthUnits, setLastMonthUnits] = useState(Number(prevElectricityUnits) || 0);
  const [currentMonthUnits, setCurrentMonthUnits] = useState(0);

  // Set default currentMonthUnits on first load if it's 0
  useEffect(() => {
    const currentUnits = Number(electricityUnits) || 0;
    if (currentUnits === 0) {
      setCurrentMonthUnits(Number(prevElectricityUnits) || 0);
    } else {
      setCurrentMonthUnits(currentUnits);
    }
  }, [electricityUnits, prevElectricityUnits]);

  const electricityCost = truncateNumber(unitCost * (currentMonthUnits - lastMonthUnits));

  return (
    <Modal onClose={onClose}>
      <div className='w-[320px] space-y-4'>
        <h2 className='text-lg font-semibold text-foreground'>Edit Electricity</h2>
        
        <form className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='unit-cost'>Unit Cost (kWh)</Label>
            <Input
              type='number'
              id='unit-cost'
              value={unitCost}
              onChange={(e) => setUnitCost(Number(e.target.value))}
              placeholder='Ex: 8'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='last-month-units'>Last Month Units</Label>
            <Input
              type='number'
              id='last-month-units'
              value={lastMonthUnits}
              readOnly
              className="bg-secondary text-muted-foreground cursor-default pointer-events-none"
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='current-month-units'>Current Month Units</Label>
            <Input
              type='number'
              id='current-month-units'
              value={currentMonthUnits}
              onChange={(e) => setCurrentMonthUnits(Number(e.target.value))}
              placeholder='Current Month Units'
            />
          </div>

          <div className='flex items-center justify-between text-base font-medium text-foreground pt-2'>
            <Label htmlFor='electricity-cost'>Cost</Label>
            <span className='text-xl text-gray-800' id='electricity-cost'>
              ₹ {electricityCost}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-2 pt-2'>
            <Button
              id='cancel-btn'
              onClick={(e) => {
                e.preventDefault();
                onClose();
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              id="save-electricity-btn"
              onClick={(e) => {
                e.preventDefault();
                onChange({
                  electricityCost: Number(electricityCost) || 0,
                  electricityUnits: Number(currentMonthUnits) || 0,
                });
              }}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}