import { useState, FormEvent, ChangeEvent } from "react";
import { sendEnquiry } from "../services/enquiryService";

interface EnquiryFormProps {
    propertyId: string;
}

function EnquiryForm({
    propertyId,
}: EnquiryFormProps) {
    const [message, setMessage] =
        useState<string>("");

    const submitHandler = async (
        e: FormEvent<HTMLFormElement>
    ): Promise<void> => {
        e.preventDefault();

        await sendEnquiry(
            propertyId,
            message
        );
    };

    return (
        <form onSubmit={submitHandler}>
            <textarea
                value={message}
                onChange={(
                    e: ChangeEvent<HTMLTextAreaElement>
                ) =>
                    setMessage(e.target.value)
                }
            />

            <button type="submit">
                Send
            </button>
        </form>
    );
}

export default EnquiryForm;