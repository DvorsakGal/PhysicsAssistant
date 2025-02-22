import { useEffect, useState } from "react";
import EducationalContent, { EducationalContentProps } from "./EducationalContent"
import axios from "axios";

type ContentListProps = {
    contents?: EducationalContentProps[];
}

export default function ContentList(props: ContentListProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [contents, setContents] = useState<EducationalContentProps[]>([])

    // Fetch initial data when the component mounts
    useEffect(() => {
        const fetchInitialContent = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/educational-data");
                setContents(response.data);
            } catch (error) {
                console.error("Error fetching initial content:", error);
            }
        };

        fetchInitialContent();
    }, []); // Empty dependency array ensures this runs only once

    // Handle dynamic search filtering
    useEffect(() => {
        if(searchTerm.trim() === "") {
            // Reset to initial fetch if search is cleared
            const fetchInitialContent = async () => {
                try {
                    const response = await axios.get("http://127.0.0.1:5000/educational-data");
                    setContents(response.data);
                } catch (error) {
                    console.error("Error fetching initial content:", error);
                }
            };

            fetchInitialContent();
            return;
        }

        const fetchFilteredContent = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/educational-data/search", {
                    params: { title: searchTerm },
                });
                setContents(response.data);
            } catch (error) {
                console.error("Error fetching filtered content: ", error);
            }
        };

        const timeoutId = setTimeout(fetchFilteredContent, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, props.contents]);


    return(
        <div>
            <button onClick={() => window.location.reload()}>
                Refresh Content List
            </button>
            <br />
            <input 
                type="text" 
                placeholder="Search educational content..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div>
                {contents.map((content, index) => (
                    <EducationalContent key={index} {...content} />
                ))}
            </div>
        </div>
    )
}



/*
const contents = props.contents || [];


<ul>
            {contents.map((content) => (
                <li key={content.id}>
                    <EducationalContent id={content.id} title={content.title} summary={content.summary} link={content.link} createdAt={content.createdAt} />
                </li>
            ))}
        </ul>
*/