import './App.css'
import ContentPage from './components/content/ContentPage'
import Helper from './components/helper/Helper'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Flask server URL

function App() {
  useEffect(() => {
    // Listen for new notifications from Flask
    socket.on('new_notification', (notification) => {
      const userEmail = localStorage.getItem('userEmail'); // Retrieve email from localStorage

      if (notification.email === userEmail) {
        alert(`New content added: ${notification.title} - ${notification.summary}`);
        // Optionally update the state to display the notification in the UI
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('new_notification');
    };
  }, []);

  return(
    <>
        <Router>
          <Navbar />
          <div className='main-content'>
            <Routes>
              <Route path="/" element={<ContentPage />}/>
              <Route path="/workstation" element={<Helper />}/>
              <Route path="/profile" element={<Profile />}/>
            </Routes>
          </div>
        </Router>
    </>
  )
}

export default App


/*
<Router>
      <Layout>
        <Routes>
          <Route exact path="/" element={<Home/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/recovery-password" element={<RecoveryPassword/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Layout>
    </Router>
*/