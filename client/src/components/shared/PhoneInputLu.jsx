import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css';

export default function PhoneInputLu({ nameValue, valueInput, onChangeInput, formError }) {
    return (
        <>
            <PhoneInput
                country="in"
                value={valueInput}
                onChange={onChangeInput}
                inputProps={{
                    name: nameValue,
                    required: true,
                    autoFocus: false,
                    placeholder: 'Enter phone number',
                }}
                inputStyle={{
                    width: '100%',
                    height: '36px',
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    paddingLeft: '48px',
                }}
                containerClass="!w-full"
                buttonClass="focus-visible:!ring-[3px] focus-visible:!border-ring focus-visible:!ring-ring/50 transition-shadow rounded-md"
                inputClass="!rounded-md !shadow-xs !border-input focus-visible:!ring-[3px] focus-visible:!border-ring focus-visible:!ring-ring/50 transition-shadow"
            />
            {formError && (
              <span className="text-xs text-destructive">{formError}</span>
            )}
        </>
    );
}