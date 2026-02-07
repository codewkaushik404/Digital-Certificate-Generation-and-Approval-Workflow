import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import AlertBasic from "./Alert"
//import { useState } from "react"

export default function SignupStepOne({ className, ...props }) {

  const [confirmPassword, setConfirmPassword] = useState("");

  function handleChange(e){
    const {id, value} = e.target
    props.setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  }
  
  function handleSubmitOne(e){
    e.preventDefault();

    if(props.form.password !== confirmPassword){
      return (
      <AlertBasic alert={{type: "error", message: "Entered Password doesn't match with confirmed password"}}/>
      );
    }
    props.setStep((step) => step+1);
  }
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={ handleSubmitOne }>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" type="text" placeholder="Sponge Bob" value={props.form.name} onChange={handleChange} required />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="spongebob@gmail.com" value={props.form.email} onChange={handleChange} required />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" value={props.form.password} onChange={handleChange} required />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input id="confirm-password" type="password" 
          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <FieldDescription>Please confirm your password.</FieldDescription>
        </Field>

        <Field>
          <Button type="submit">Continue</Button>
        </Field>
        
        <FieldDescription className="px-6 text-center">
          Already have an account? <a href="/login">Sign in</a>
        </FieldDescription>

      </FieldGroup>
    </form>
  );
}
