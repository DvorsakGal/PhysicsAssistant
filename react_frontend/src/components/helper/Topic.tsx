
type TopicProps = {
    id: number;
    topicName: string;
    onDelete: (id: number) => void;
}

export default function Topic(props: TopicProps) {
    const containerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        marginBottom: "8px",
        backgroundColor: "#f9f9f9",
    };

    const textStyle = {
        margin: 0,
        fontSize: "16px",
        fontWeight: "500",
        color: "#333",
    };

    const buttonStyle = {
        padding: "6px 12px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#ff4d4f",
        color: "#fff",
        cursor: "pointer",
        fontSize: "14px",
    };

    return(
        <div style={containerStyle}>
            <h4 style={textStyle}>{props.topicName}</h4>
            <button style={buttonStyle} onClick={() => props.onDelete(props.id)}>Delete</button>
        </div>
    )
}