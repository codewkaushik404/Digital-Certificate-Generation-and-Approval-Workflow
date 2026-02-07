import { GalleryVerticalEnd } from "lucide-react"

import SignupStepOne from "@/components/signup-step-one"
import SignupStepTwo from "@/components/signup-step-two"
import { useState } from "react"

export default function RegisterPage() {

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
      name: "",
      email: "",
      password: "",
      instituteName: "",
      department: "",
      joiningYear: "",
      duration: ""
    });

  return (
    <div className="grid min-h-svh lg:grid-cols-2 ">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <p className="text-xl">Certify</p>
          </a>
        </div>
        <div className="bg-white shadow-2xl rounded-xl flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            { step === 1
            ? <SignupStepOne setStep={setStep} setForm={setForm} form={form} /> 
            : <SignupStepTwo setStep={setStep} setForm={setForm} form={form} /> 
            }
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/collegePic.jpeg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
