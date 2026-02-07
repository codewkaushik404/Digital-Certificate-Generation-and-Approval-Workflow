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
import AlertBasic from "./Alert";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function SignupStepTwo({className, ...props}) {

  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    type: "",
    message: ""
  });

  function handleChange(e){
    const {id, value} = e.target;
    props.setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  async function handleSubmit(e){
    try{
      e.preventDefault();
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/register`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(props.form),
      });
      
      const data = await response.json();
      console.log(data);
      if(!response.ok) setAlert({type: "error", message: data.message || "Something went wrong"});

      else{
        setAlert({type: "success", message: data.message || "Registration successful"});
        props.setForm({
          email: "",
          name: "",
          password: "",
          instituteName: "",
          department: "",
          joiningYear: "",
          duration: ""
        });
        setTimeout(()=>{
          navigate("/login");
        },2000);
      }

    }catch(err){
      setAlert({type: "error", message: err.message || "Network Error"});
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}
    onSubmit={handleSubmit} >
      <FieldGroup>
        {!alert.message 
          ? (<div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="text-muted-foreground text-sm text-balance">
              Fill in the form below to create your account
            </p>
          </div>)
          : <AlertBasic alert={alert}/>
        }
        <Field>
          <FieldLabel htmlFor="instituteName">Name of Institute</FieldLabel>
          <Input id="instituteName" type="text" placeholder="Harvard University" 
          value={props.form.instituteName} onChange={handleChange}  required/>
        </Field>

        <Field>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <Input id="department" type="text" placeholder="CSE" 
          value={props.form.department} onChange={handleChange} required/>
        </Field>

        <Field>
          <FieldLabel htmlFor="joiningYear">Year of Joining</FieldLabel>
          <Input id="joiningYear" type="text" 
          value={props.form.joiningYear} onChange={handleChange}  required/>
        </Field>

        <Field>
          <FieldLabel htmlFor="duration">Duration</FieldLabel>
          <Input id="duration" type="text" placeholder="4" 
          value={props.form.duration} onChange={handleChange}  required/>
        </Field>

        <Field>
          <Button type="button" onClick={()=> props.setStep((step) => step-1)}>Back</Button>
        </Field>

        <Field>
          <Button type="submit">Create Account</Button>
        </Field>
        
        <FieldDescription className="px-6 text-center">
          Already have an account? <a href="/login">Sign in</a>
        </FieldDescription>

      </FieldGroup>
    </form>
  );
}
