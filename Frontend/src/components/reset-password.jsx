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
import {useNavigate } from "react-router-dom"
import AlertBasic from "./Alert";
import {useState} from "react";

export function ResetPasswordForm({ className, ...props }) {
    const [form, setForm] = useState({
        newPassword: "",
        confirmNewPassword: ""
    });
    const [alert, setAlert] = useState({
        type: "", message: ""
    })
    //const [isDisabled, setIsDisabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleChange(e){
        console.log(e.target.value);
        const {id, value} = e.target;
        setForm((prev)=>({
            ...prev,
            [id]: value
        }));
    }

    async function handleSubmit(e){
        try{
            e.preventDefault();
            setLoading(true);

            if(form.newPassword.trim() === "" || form.confirmNewPassword.trim() === ""){
                setAlert({type: "error", message: "Password fields cannot be empty"});
                return ;
            }

            else if(form.newPassword !== form.confirmNewPassword){
                setAlert({type: "error", message: "New and confirmed passwords do not match"});
                return ;
            }

            const searchParams = new URLSearchParams(window.location.search);
            const token = searchParams.get("token");

            if (!token) {
                setAlert({ type: "error", message: "Invalid or missing reset token." });
                return;
            }

            const res = await fetch("http://localhost:5000/api/v1/auth/reset-password", {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ token: token, newPassword: form.newPassword })
            })

            const response = await res.json();
            console.log("Response is:",response);
            if(res.ok){
                setAlert({type: "success", message: response.message || "Password reset successful"});
                setForm({
                    newPassword: "",
                    confirmNewPassword: ""
                });
                setTimeout(()=>{
                    navigate("/login")
                },2000);
            }
            else setAlert({type: "error", message: response.message || "Error occured"});

        }catch(err){
            setAlert({type: "error", message: err.message || "Error occured"});
        }
        finally{
            setLoading(false);
        }
    }

    if(loading) return <div>Loading...</div>

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
                            ? <h1 className="text-2xl font-bold">Create a New Password</h1>
                            : <AlertBasic alert={alert}/>
                            }
                            
                        </div>
                        <FieldDescription className="text-center">
                            Enter your new password below to complete the reset process.
                            Ensure it's strong and secure
                        </FieldDescription>
                        <Field>
                            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                            <Input id="newPassword" type="password" placeholder="Enter your password"
                            value={form.newPassword} onChange={handleChange} 
                            required />

                            <FieldLabel htmlFor="confirmNewPassword">Confirm New Password</FieldLabel>
                            <Input id="confirmNewPassword" type="password" placeholder="Enter your password"
                            value={form.confirmNewPassword} onChange={handleChange} 
                            required />
                        </Field>
                         
                        <Field>
                            <Button type="submit">Submit</Button>
                        </Field>
                        
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
