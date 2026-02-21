import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"


import { Input } from "@/components/ui/input"
import { useState} from "react"
import AlertBasic from "./Alert";
import { Link, useNavigate } from "react-router-dom"
import { useUserContext } from "@/context/userContext"
export function LoginForm({ className, ...props }) {

  const {setIsUserLoggedIn, setIsOnboardingComplete} = useUserContext();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [alert, setAlert] = useState({
      type: "",
      message: ""
  });

  const navigate = useNavigate();

  function handleChange(e){
    const {id, value} = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value
    }));
  }

  async function submitLogin(e){
    try{
      e.preventDefault();
      //console.log("Form submitted with data:", form);
      const res = await fetch(`http://localhost:5000/api/v1/auth/login`,{
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

      
      const response = await res.json();
      if(!res.ok) setAlert({type: "error", message: response.message || "Something went wrong"});
      else{
        setIsUserLoggedIn(response.data || {});
        setIsOnboardingComplete(response.data.onboardingComplete || false);
        setAlert({type: "success", message: response.message || "Login successful" });
        setForm({email: "", password: ""});
        setTimeout(()=>{
          navigate("/");
        },2000)
      }
    }
    catch(err){
      //console.error(err);
      setAlert({type: "error", message: err.message || "Network error" });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 rounded-2xl bg-background">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* This is how u submit in a form */}
          <form className="p-6 md:p-8" onSubmit={submitLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                {/**Conditionally render it here */}
                {!alert.message ? 
                  (
                  <>
                    <h1 className="text-2xl font-bold">Welcome back</h1>
                    <p className="text-muted-foreground text-balance">
                      Login to your Certify account
                    </p>
                  </>
                  )
                  : <AlertBasic alert={alert}/>
                }
                
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input id="email" type="email" placeholder="spongebob@gmail.com" 
                value={form.email} onChange={handleChange}  required />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" value={form.password} onChange={handleChange} required />
              </Field>
              <Field>
                <Button type="submit">Login</Button>
              </Field>

              <Button variant="outline" type="button" 
                onClick={ () => { window.location.href="http://localhost:5000/api/v1/auth/google" }}>                
                <img src="/google.png" width={20}></img>
                  Login with Google
              </Button>
    
              <FieldDescription className="text-center">
                Don't have an account? <Link to="/register" className="text-sm font-normal">Register</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/collegePic.jpeg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
