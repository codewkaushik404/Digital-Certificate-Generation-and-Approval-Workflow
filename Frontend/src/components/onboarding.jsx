import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import DepartmentBox from "./departmentBox"
import { Input } from "@/components/ui/input"
import AlertBasic from "./Alert";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/userContext";

export default function OnboardingForm({className, ...props}) {

  const { setIsOnboardingComplete } = useUserContext();
  const [form, setForm] = useState({
    instituteName: "",
    department: "",
    joiningYear: "",
    duration: ""
  })
  const navigate = useNavigate();
  const [alert, setAlert] = useState({
    type: "",
    message: ""
  });

  function handleChange(e){
    const {id, value} = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  async function handleSubmit(e){
    try{
      e.preventDefault();
      // eslint-disable-next-line no-unused-vars 
      
      //console.log("before fetching")
      const response = await fetch("http://localhost:5000/api/v1/auth/onboarding",{
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // Required to send session cookie
        body: JSON.stringify(form),
      });
      
      const data = await response.json();
      //console.log(data);
      if(!response.ok) setAlert({type: "error", message: data.message || "Something went wrong"});

      else{
        setIsOnboardingComplete(data.data || false);
        setAlert({type: "success", message: data.message || "Registration successful"});
        setForm({
          instituteName: "",
          department: "",
          joiningYear: "",
          duration: ""
        });
        setTimeout(()=>{
          navigate("/");
        },1500);
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
          value={form.instituteName} onChange={handleChange}  required/>
        </Field>

        
        
        <Field>
          <FieldLabel htmlFor="department">Department</FieldLabel>
          <DepartmentBox 
            value={form.department} 
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="joiningYear">Year of Joining</FieldLabel>
          <Input id="joiningYear" type="text" 
          value={form.joiningYear} onChange={handleChange}  required/>
        </Field>

        <Field>
          <FieldLabel htmlFor="duration">Duration</FieldLabel>
          <Input id="duration" type="text" placeholder="4" 
          value={form.duration} onChange={handleChange}  required/>
        </Field>

        <Field>
          <Button type="submit">Create Account</Button>
        </Field>

      </FieldGroup>
    </form>
  );
}
