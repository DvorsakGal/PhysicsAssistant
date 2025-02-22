import { useState } from "react";
import InputTopic from "./TopicInput";
import TopicList from "./TopicList";
import Formulas from "./Formulas";
import AiTutor from "./AiTutor";
import styles from "./Helper.module.css";

export type TopicType = {
    id: number;
    topicName: string;
}


export default function Helper() {

    const [topics, setTopics] = useState<TopicType[]>([]);

    function handleAddTopic(text: string) {
        setTopics(prevTopics => {
            const newTopic: TopicType = {
                id: Math.random(),
                topicName: text,
            };

            return[...prevTopics, newTopic]
            //error: Helper.tsx:29 Uncaught TypeError: prevTopics is not iterable
            //at Helper.tsx:29:24
            //at Helper (Helper.tsx:20:33)
        })
    }

    // Delete a topic by ID
    function handleDeleteTopic(id: number) {
        setTopics((prevTopics) => prevTopics.filter((topic) => topic.id !== id));
    }

    return(
        <div className={styles.helper}>
            <div className={`${styles["helper-section"]} ${styles["section-one"]}`}>
                <div className={styles["section-one-left"]}>
                    <InputTopic onAddTopic={handleAddTopic} />
                    <TopicList topics={topics} onDeleteTopic={handleDeleteTopic} />
                </div>
                <div className={styles["section-one-right"]}>
                    <Formulas topics={topics} />
                </div>
            </div>

            <div className={`${styles["helper-section"]} ${styles["section-two"]}`}>
                <AiTutor />
            </div>
        </div>
    )
}
//<div className={styles.addDeleteContent}></div>