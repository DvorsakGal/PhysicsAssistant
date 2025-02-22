import { FormEvent, useRef } from "react"
import styles from "./InputTopic.module.css";

type TopicFormProp = {
    onAddTopic: (topicName: string) => void;
}

export default function InputTopic(props: TopicFormProp) {

    const  newTopic = useRef<HTMLInputElement>(null);

    function handleSubmitTopic(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const enteredTopic = newTopic.current!.value;
        event.currentTarget.reset();
        props.onAddTopic(enteredTopic); //IMPLEMENTIRAJ FUNKCIJO onAddTopic
    }



    return(
        <form className={styles.form} onSubmit={handleSubmitTopic}>
            <label htmlFor="newTopic" className={styles.label}>Add a topic: </label>
            <input 
                id="newTopic" 
                type="text" 
                ref={newTopic} 
                className={styles.input} 
                placeholder="Enter topic here..." 
            />
            <button className={styles.button}>Add Topic</button>
        </form>
    )
}