import { useEffect, useState } from "react";
import { useUserContext } from "@/context/userContext";
import { Navigate } from "react-router-dom";

export default function Redirect(){
    const { isOnboardingComplete, isUserLoggedIn, setIsUserLoggedIn, setIsOnboardingComplete } = useUserContext();
    const [loading, setLoading] = useState(true);
    
    console.log("Role redirect isUserLoggedIn: ",isUserLoggedIn);
    console.log("Role redirect isOnboardingComplete: ",isOnboardingComplete);
    // Check authentication status on mount (especially after Google OAuth redirect)
    useEffect(() => {
        async function checkAuth() {
            try {
                const response = await fetch("http://localhost:5000/api/v1/auth/me", {
                    method: "GET",
                    credentials: "include"
                });

                if (response.ok) {
                    const data = await response.json();
                    // Set user data in context
                    if (data.data) {
                        setIsUserLoggedIn(data.data);
                        setIsOnboardingComplete(data.data.onboardingComplete || false);
                    }
                } else {
                    // Not authenticated
                    setIsUserLoggedIn(null);
                    setIsOnboardingComplete(false);
                }
            } catch (err) {
                console.error("Error checking auth:", err);
                setIsUserLoggedIn(null);
                setIsOnboardingComplete(false);
            } finally {
                setLoading(false);
            }
        }
        
        // Only check if user state is not already set
        if (isUserLoggedIn === null || Object.keys(isUserLoggedIn).length === 0) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [setIsUserLoggedIn, setIsOnboardingComplete, isUserLoggedIn]);

    // Show loading while checking authentication
    if (loading) {
        return <div>Loading...</div>;
    }

    // If not logged in, redirect to register
    if(!isUserLoggedIn || Object.keys(isUserLoggedIn).length === 0) {
        return <Navigate to="/login" replace/>;
    }

    if(!isOnboardingComplete){
        return <Navigate to="/onboarding" />;
    }

    return <Navigate to="/dashboard" replace/>;
}