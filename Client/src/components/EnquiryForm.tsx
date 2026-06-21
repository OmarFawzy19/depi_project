import { useState, FormEvent, ChangeEvent } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { sendEnquiry } from "../services/enquiryService";

interface EnquiryFormProps {
    propertyId: string;
}

function EnquiryForm({ propertyId }: EnquiryFormProps) {
    const [message, setMessage] = useState<string>("");
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast();

    const submitHandler = async (
        e: FormEvent<HTMLFormElement>,
    ): Promise<void> => {
        e.preventDefault();

        if (!message.trim()) {
            toast({
                title: "Message required",
                description: "Please enter your enquiry before sending.",
                variant: "destructive",
            });
            return;
        }

        try {
            setSubmitting(true);
            await sendEnquiry(propertyId, message.trim());
            setMessage("");
            toast({
                title: "Inquiry sent",
                description: "Your enquiry has been sent to the owner.",
            });
        } catch (error) {
            console.error("Send enquiry failed", error);
            toast({
                title: "Send failed",
                description: "Unable to send enquiry. Please try again later.",
                variant: "destructive",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={submitHandler} className="space-y-3">
            <textarea
                value={message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                }
                placeholder="Write your message to the property owner..."
                className="min-h-[140px] w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

            <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Sending..." : "Send Inquiry"}
            </Button>
        </form>
    );
}

export default EnquiryForm;