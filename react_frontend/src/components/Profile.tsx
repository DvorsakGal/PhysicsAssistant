import { FormEvent, useRef, useState } from "react";

export default function Profile() {
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("userEmail") || null
  ); // Initialize with the stored email if it exists
  const emailInputRef = useRef<HTMLInputElement>(null);

  function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current!.value.trim();

    if (enteredEmail) {
      localStorage.setItem("userEmail", enteredEmail);
      setEmail(enteredEmail);
      event.currentTarget.reset(); // Clear the form input
    }
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Profile</h1>
      <form onSubmit={handleEmailSubmit} style={formStyle}>
        <label htmlFor="email" style={labelStyle}>
          Enter your email:
        </label>
        <input
          type="email"
          id="email"
          ref={emailInputRef}
          placeholder="example@example.com"
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>
          Save Email
        </button>
      </form>
      {email && (
        <div style={savedEmailStyle}>
          <p>
            <strong>Saved Email:</strong> {email}
          </p>
        </div>
      )}
    </div>
  );
}

// Define CSS styles as objects
const containerStyle: React.CSSProperties = {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  };
  
  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    color: "#333",
  };
  
  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  };
  
  const labelStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#555",
  };
  
  const inputStyle: React.CSSProperties = {
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  };
  
  const buttonStyle: React.CSSProperties = {
    padding: "10px 15px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#1976d2",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };
  
  const savedEmailStyle: React.CSSProperties = {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#e3f2fd",
    borderRadius: "4px",
    border: "1px solid #ddd",
  };
  

