export type EducationalContentProps = {
    id: number;
    title: string;
    summary: string;
    link: string;
    createdAt: string;
}

export default function EducationalContent(props: EducationalContentProps) {

    return(
        <div>
            <h3><a href={props.link}>{props.title}</a></h3>
            <p><strong>{props.summary}</strong></p>
        </div>
    )
}