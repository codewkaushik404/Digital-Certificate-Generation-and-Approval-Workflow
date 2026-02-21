"use client"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxItem,
    ComboboxList,
  } from "@/components/ui/combobox"

const departments = [
    { label: "Computer Science and Engineering", value: "CSE" },
    { label: "Artificial Intelligence and Machine Learning", value: "AIML" },
    { label: "Information Science and Engineering", value: "ISE" },
    { label: "Civil Engineering", value: "CIVIL" },
    { label: "Electronics and Communication Engineering", value: "ECE" },
    { label: "Electrical and Electronics Engineering", value: "EEE" },
    { label: "Mechanical Engineering", value: "MECH" }
]

export default function DepartmentBox({ value, onChange, ...props }) {
    const handleValueChange = (newValue) => {
        // Call onChange with the value (e.g., "CSE") in the format expected by handleChange
        if (onChange) {
            onChange({
                target: {
                    id: "department",
                    value: newValue || ""
                }
            });
        }
    };

    return (
        <Combobox 
            items={departments}
            value={value || null}
            onValueChange={handleValueChange}
            {...props}
        >
            <ComboboxInput 
                placeholder="Select Department"
            />
            <ComboboxContent>
                <ComboboxEmpty>No department found.</ComboboxEmpty>
                <ComboboxList>
                    {(item) => (
                        <ComboboxItem key={item.value} value={item.value}>
                            {item.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
            </ComboboxContent>
        </Combobox>
    )
}