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
import { Link, useNavigate } from "react-router-dom"
import { useUserContext } from "@/context/userContext" 
export default function RegisterForm({ className, ...props}) {

  const {setIsUserLoggedIn} = useUserContext();
  const navigate = useNavigate("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })

  const [alert, setAlert] = useState({
    type: "",
    message: ""
  });

  function handleChange(e){
    const {id, value} = e.target
    setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  }
  

  async function handleSubmit(e){
    try{
      e.preventDefault();

      if(form.password !== form.confirmPassword){
        setAlert({type: "error", message: "Entered Password doesn't match with confirmed password"});
        return;
      }
      //console.log("Form submitted with data:", form);
      const response = await fetch(`http://localhost:5000/api/v1/auth/register`,{
        method: "POST",
        headers:{
          "Content-Type": "application/json",
        },
        //Without this line the browser will ignore 
        // the setCookie header from http server
        // and doesnt send cookies on each request to server, 
        //Cookies never appear in Application tab or get sent on future requests

        /**
         * include → send cookies from the browser to the server, even for cross-origin requests
         * Also allows the browser to accept Set-Cookie headers from the server
         */
        credentials: "include",
        body: JSON.stringify(form)
      })

      
      const data = await response.json();
      if(!response.ok) setAlert({type: "error", message: data.message || "Something went wrong"});
      else{
        setIsUserLoggedIn(data.data || {});
        console.log("User data (register): ",data.data);
        setAlert({type: "success", message: data.message || "Login successful" });
        setForm({name: "", email: "", password: "", confirmPassword: ""});
        setTimeout(()=>{
          navigate("/login");
        },2000);
      }
    }
    catch(err){
      //console.error(err);
      setAlert({type: "error", message: err.message || "Network error" });
    }
  }

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={ handleSubmit }>
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
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" type="text" placeholder="Sponge Bob" value={form.name} onChange={handleChange}  />
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" type="email" placeholder="spongebob@gmail.com" value={form.email} onChange={handleChange}  />
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input id="password" type="password" value={form.password} onChange={handleChange}  />
        </Field>
        
        <Field>
          <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
          <Input id="confirmPassword" type="password" 
          value={form.confirmPassword} onChange={handleChange}  />
          { 
          !form.confirmPassword 
          ? <FieldDescription>Please confirm your password.</FieldDescription>
          : <></>
          }
        </Field>

        <Field>
          <Button type="submit">Continue</Button>
        </Field>

        <Button variant="outline" type="button" 
          onClick={ () => { window.location.href="http://localhost:5000/api/v1/auth/google" }}>                
          <img src="/google.png" width={20}></img>
            Login with Google
        </Button>
        
        <FieldDescription className="px-6 pb-2 text-center">
          Already have an account? <Link to="/login" className="font-normal">Login</Link>
        </FieldDescription>

      </FieldGroup>
    </form>
  );
}
