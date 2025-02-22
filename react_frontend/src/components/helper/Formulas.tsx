import axios from "axios";
import { TopicType } from "./Helper";
import { useState } from "react";
import styles from "./Formulas.module.css"

type FormulasProps = {
    topics: TopicType[];
}

export default function Formulas(props: FormulasProps) {

    const [data, setData] = useState<{
        formulas: { name: string, formula: string }[];
        explanations: { header: string, content: string }[];
        links: { text: string, url: string }[];
    } | null>(null);

    const [error, setError] = useState<string | null>(null);

    async function handleGetFormulas() {
        const topics = props.topics.map(topic => topic.topicName);  //pridobi nazive tem
        console.log("Sending topics to the backend: ", topics)

        try {
            const response = await axios.post("http://127.0.0.1:5000/formulas", {
                topics: topics,
            });
            setData(response.data);
            setError(null);
        } catch (error: any) {
            console.log("Error fetching formulas: ", error);
            setError(error.response?.data?.Error || "An error occured while fetching data");
        }
    }


    return(
        <>
        <button onClick={handleGetFormulas}>Get helper formulas!</button>
        <div className={styles.formulasMain}>
            {error ? (
                <p style={{color: "red"}}>{error}</p>
            ): data ? (
                <>
                    <h3>Formulas</h3>
                    <ul className={styles.ul}>
                        {data.formulas.map((formulaObject, index) => (
                            <li key={index}>
                                <strong>{formulaObject.name}</strong>: {formulaObject.formula}
                            </li>
                        ))}
                    </ul>

                    <h3>Explanations</h3>
                    <ul className={styles.ul}>
                        {data.explanations.map((explanationObject, index) => (
                            <li key={index}>
                                <h5>{explanationObject.header}</h5>
                                <p>{explanationObject.content}</p>
                            </li>
                        ))}
                    </ul>

                    <h3>Links</h3>
                    <ul className={styles.ul}>
                        {data.links.map((linkObject, index) => (
                            <li key={index}>
                                <strong>{linkObject.text}</strong>: <a href={linkObject.url} target="new">{linkObject.url}</a>
                            </li>
                        ))}
                    </ul>
                </>
            ): (
                <p>Here is space for formulas</p>
            )}
        </div>

        </>
    );
}