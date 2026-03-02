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

import {ArrowLeftToLine} from "lucide-react"

import { Input } from "@/components/ui/input"
import {useNavigate, Link } from "react-router-dom"
import AlertBasic from "./Alert";
import {useState} from "react";

export function ForgotPasswordForm({ className, ...props }) {
    const [email, setEmail] = useState("");
    const navigate = useNavigate("");
    const [alert, setAlert] = useState({
        type: "", message: ""
    })
    const [isDisabled, setIsDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e){
        try{
            e.preventDefault();
            setLoading(true);
            setIsDisabled(true);
            const res = await fetch("http://localhost:5000/api/v1/auth/forgot-password", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: email})
            })

            const response = await res.json();
            console.log("Response is:",response);
            if(res.ok){
                setAlert({type: "success", message: response.message || "Email sent"});
                setEmail(null);
            }
            else setAlert({type: "error", message: response.message || "Error occured"});            

        }catch(err){
            setAlert({type: "error", message: err.message || "Error occured"});
        }
        finally{
            setLoading(false);
        }
    }
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 mb-2 rounded-2xl bg-background">
                <CardContent className="grid p-0 md:grid-cols-2 ">
                {/* This is how u submit in a form */}
                <form className="p-6 md:p-8 mb-15 mx-3" onSubmit={handleSubmit}>
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-1 text-center">
                            {/**Conditionally render it here */}
                            {!alert.message 
                            ? <h1 className="text-2xl font-bold">Forgot your password?</h1>
                            : <AlertBasic alert={alert}/>
                            }
                            
                        </div>
                        <FieldDescription className="text-center">
                            Enter your email address and we’ll send you a link to reset your password.
                        </FieldDescription>
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="email" placeholder="spongebob@gmail.com"
                            value={email} onChange={(e)=> setEmail(e.target.value)} 
                            required />
                        </Field>
                         
                        <Field>
                            <Button type="submit" disabled={isDisabled && alert?.type === "success"}>Send email</Button>
                            <Button variant="outline" type="button" disabled={loading}
                                onClick={() => navigate("/login")}>
                                    <ArrowLeftToLine />
                                    Back to Login
                            </Button>
                        </Field>

                        <FieldDescription className="text-center">
                            Didn't receive the email? <a href="/forgot-password" className="text-sm font-normal">Resend</a>
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
