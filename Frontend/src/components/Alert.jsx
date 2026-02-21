import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2Icon, AlertCircleIcon } from "lucide-react"

export default function AlertBasic({alert}) {
  if (!alert) return null;

  return (
    <Alert variant={alert.type === "success" ? "default" : "destructive"} className="max-w-md">
      { alert.type === "success"? <CheckCircle2Icon /> : <AlertCircleIcon /> }
      <AlertDescription>{alert.message}</AlertDescription>
    </Alert>
  )}
