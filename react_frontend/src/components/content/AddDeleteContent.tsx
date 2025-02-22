import axios, { formToJSON } from "axios";
import { useState } from "react";

export default function AddDeleteContent() {
    const [formType, setFormType] = useState<"add" | "delete" | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        link: "",
        level: "",
    });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value});
    }

    const handleAddContent = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:5000/educational-data", {
                title: formData.title,
                summary: formData.summary,
                link: formData.link,
                level: formData.level
            });
            setSuccessMessage("Content added successfully!");
            setFormType(null);
            setFormData({title: "", summary: "", link: "", level: ""});
        } catch (error:any) {
            alert(error.response?.data?.error || "An error occured!")
        }
    };

    const handleDeleteContent = async () => {
        try {
            const response = await axios.delete("http://127.0.0.1:5000/educational-data", {
                data: {title: formData.title},
            });
            setSuccessMessage("Content deleted successfully!");
            setFormType(null);
            setFormData({title: "", summary: "", link: "", level: ""});
        } catch (error:any) {
            alert(error.response?.data.error || "An error occured!");
        }
    };

    const containerStyle = {
        fontFamily: "'Arial', sans-serif",
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
    };

    const buttonStyle = {
        padding: "10px 15px",
        margin: "5px",
        backgroundColor: "#007BFF",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold",
    };

    const buttonStyleDelete = {
        ...buttonStyle,
        backgroundColor: "#DC3545", // Red for delete
    };

    const formStyle = {
        marginTop: "20px",
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
        fontSize: "14px",
    };

    const submitButtonStyle = {
        ...buttonStyle,
        width: "100%",
        backgroundColor: "#28A745", // Green for submit
    };

    const messageStyle = {
        color: successMessage?.includes("successfully") ? "green" : "red",
        marginTop: "10px",
    };

    return(
        <div style={containerStyle}>
            <h2>
                Manage Educational Content
            </h2>
            <div>
                <button style={buttonStyle} onClick={() => setFormType("add")}>Add Content</button>
                <button style={buttonStyleDelete} onClick={() => setFormType("delete")}>Delete Content</button>
            </div>
            <div>
                {successMessage && <p style={messageStyle}>{successMessage}</p>}
            </div>

            {formType && (
                <form style={formStyle} onSubmit={(e) => {
                    e.preventDefault();
                    if(formType === "add") handleAddContent();
                    else if(formType === "delete") handleDeleteContent();
                }}>
                    <h4>{formType === "add" ? "Add Content" : "Delete Content"}</h4>

                    {/* Title Field */}
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        style={inputStyle}
                        />
                    </div>

                    {/* Additional Fields for Add */}
                    {formType === "add" && (
                        <>
                        <div>
                            <label htmlFor="summary">Summary:</label>
                            <input
                            type="text"
                            id="summary"
                            name="summary"
                            value={formData.summary}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                            />
                        </div>
                        <div>
                            <label htmlFor="link">Link:</label>
                            <input
                            type="text"
                            id="link"
                            name="link"
                            value={formData.link}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                            />
                        </div>
                        <div>
                            <label htmlFor="level">Level:</label>
                            <input
                            type="text"
                            id="level"
                            name="level"
                            value={formData.level}
                            onChange={handleInputChange}
                            required
                            style={inputStyle}
                            />
                        </div>
                        </>
                    )}

                    <button type="submit" style={submitButtonStyle}>Submit</button>

                </form>
            )}
        </div>
    )
}