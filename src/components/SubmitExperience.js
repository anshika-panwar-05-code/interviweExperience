// // src/components/SubmitExperience.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const SubmitExperience = () => {
//   const [name, setName] = useState('');
//   const [country, setCountry] = useState('');
//   const [company, setCompany] = useState('');
//   const [questions, setQuestions] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
//     try {
//       await axios.post('http://localhost:5000/submissions', { 
//         name, 
//         country, 
//         company, 
//         questions: questions.split(',') 
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       navigate('/submissions');  // Redirect to submissions page
//     } catch (err) {
//       console.error('Error submitting experience:', err);
//     }
//   };

//   return (
//     <div>
//       <h2>Submit Interview Experience</h2>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="text" 
//           placeholder="Your Name" 
//           value={name} 
//           onChange={(e) => setName(e.target.value)} 
//         />
//         <input 
//           type="text" 
//           placeholder="Country" 
//           value={country} 
//           onChange={(e) => setCountry(e.target.value)} 
//         />
//         <input 
//           type="text" 
//           placeholder="Company" 
//           value={company} 
//           onChange={(e) => setCompany(e.target.value)} 
//         />
//         <input 
//           type="text" 
//           placeholder="Interview Questions (comma separated)" 
//           value={questions} 
//           onChange={(e) => setQuestions(e.target.value)} 
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default SubmitExperience;






// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const SubmitExperience = () => {
//   const [name, setName] = useState('');
//   const [country, setCountry] = useState('');
//   const [company, setCompany] = useState('');
//   const [questions, setQuestions] = useState('');
//   const navigate = useNavigate();

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       // If no token is found, redirect the user to login page
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       // If the token doesn't exist, redirect to login
//       navigate('/login');
//       return;
//     }

//     try {
//       await axios.post('http://localhost:5000/submissions', { 
//         name, 
//         country, 
//         company, 
//         questions: questions.split(',') 
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       navigate('/submissions');  // Redirect to submissions page after success
//     } catch (err) {
//       console.error('Error submitting experience:', err);
//     }
//   };

//   return (
//     <div>
//       <h2>Submit Interview Experience</h2>
//       <form onSubmit={handleSubmit}>
//         <input 
//           type="text" 
//           placeholder="Your Name" 
//           value={name} 
//           onChange={(e) => setName(e.target.value)} 
//         />
//         <input 
//           type="text" 
//           placeholder="Country" 
//           value={country} 
//           onChange={(e) => setCountry(e.target.value)} 
//         />
//         <input 
//           type="text" 
//           placeholder="Company" 
//           value={company} 
//           onChange={(e) => setCompany(e.target.value)} 
//         />
//         <input 
//           type="text" 
//           placeholder="Interview Questions (comma separated)" 
//           value={questions} 
//           onChange={(e) => setQuestions(e.target.value)} 
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default SubmitExperience;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SubmitExperience = () => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [company, setCompany] = useState('');
  const [questions, setQuestions] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // For feedback
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setErrorMessage('Please log in to submit your experience.');
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      setErrorMessage('You must be logged in to submit.');
      navigate('/login');
      return;
    }

    try {
      // API call to submit experience
      await axios.post(
        'http://localhost:5000/submissions',
        { 
          name, 
          country, 
          company, 
          questions: questions.split(',').map((q) => q.trim()), // Split questions and trim spaces
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate('/submissions'); // Redirect to submissions page after success
    } catch (err) {
      console.error('Error submitting experience:', err);

      // Handle specific HTTP errors
      if (err.response && err.response.status === 401) {
        setErrorMessage('Session expired. Please log in again.');
        localStorage.removeItem('token'); // Remove invalid token
        navigate('/login');
      } else {
        setErrorMessage('An error occurred while submitting your experience.');
      }
    }
  };

  return (
    <div>
      <h2>Submit Interview Experience</h2>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display errors */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Country" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Company" 
          value={company} 
          onChange={(e) => setCompany(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Interview Questions (comma separated)" 
          value={questions} 
          onChange={(e) => setQuestions(e.target.value)} 
          required 
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SubmitExperience;

