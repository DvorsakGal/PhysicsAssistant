import { FormEvent, useRef, useState } from "react"
import axios from "axios";
import styles from "./AiTutor.module.css";


export default function AiTutor() {
    const[response, setResponse] = useState<string | null>(null);
    const[error, setError] = useState<string | null>(null);

    const prompt = useRef<HTMLTextAreaElement>(null);

    async function handleAskTutor(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const enteredPrompt = prompt.current!.value;
        event.currentTarget.reset();

        try {
            setError(null);
            setResponse(null);  //clear previous response or error

            const res = await axios.post("http://127.0.0.1:5000/ask_tutor", {
                prompt: enteredPrompt,
            });
            setResponse(res.data.response);
        } catch (error: any) {
            console.error("Error communicating with the backend: ", error);
            setError(error.response?.data?.Error || "An error occured");
        }
    }

    return(
        <div className={styles.tutorContainer}>
            <form onSubmit={handleAskTutor} className={styles.tutorForm}>
                <label htmlFor="prompt" className={styles.label}>
                    Enter your physics question:
                </label>
                <textarea
                    id="prompt"
                    ref={prompt}
                    className={styles.textarea}
                    placeholder="Type your question here..."
                />
                <button className={styles.button}>Ask Schrody!</button>
            </form>

            <div className={styles.responseContainer}>
                <h3 className={styles.responseTitle}>Schrody says:</h3>
                <div className={styles.responseContent}>
                    {error ? (
                        <p className={styles.error}>Error: {error}</p>
                    ) : response ? (
                        <p className={styles.response}>{response}</p>
                    ) : (
                        <p className={styles.waiting}>Waiting for a question...</p>
                    )}
                </div>
            </div>
        </div>
        
    );
}