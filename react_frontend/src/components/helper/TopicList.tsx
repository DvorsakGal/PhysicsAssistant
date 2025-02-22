import { TopicType } from "./Helper";
import Topic from "./Topic";

type TopicListProps = {
    topics: TopicType[];
    onDeleteTopic: (id: number) => void;
}

export default function TopicList(props: TopicListProps) {
    const listStyle = {
        listStyleType: "none", 
        padding: 10,          
        margin: 0,            
    };

    const topics = props.topics || [];
    return(
        <ul style={listStyle}>
            {topics.map((topic) => (
                <li key={topic.id}>
                    <Topic id={topic.id} topicName={topic.topicName} onDelete={props.onDeleteTopic} />
                </li>
            ))}
        </ul>
    )
}