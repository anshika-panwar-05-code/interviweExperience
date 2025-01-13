// // src/components/Home.js
// import React from 'react';

// const Home = () => {
//   return (
//     <div>
//       <h2>Welcome to the Interview Experience Platform!</h2>
//       <p>This platform allows you to share and view interview experiences.</p>
//     </div>
//   );
// };

// export default Home;


// src/components/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate('/submissions');
  };

  const handleSubmitClick = () => {
    navigate('/submit-experience');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welcome to the Interview Experience Platform!</h2>
      <p style={styles.subheading}>
        Discover insights, share your experiences, and help others navigate the interview process.
      </p>
      <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={handleExploreClick}>
          Explore Experiences
        </button>
        <button style={{ ...styles.button, ...styles.secondaryButton }} onClick={handleSubmitClick}>
          Share Your Experience
        </button>
      </div>
    </div>
  );
};

// Inline styles for simplicity
const styles = {
  container: {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '20px',
  },
  subheading: {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '600px',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
  },
  button: {
    padding: '12px 20px',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3498db',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  secondaryButton: {
    backgroundColor: '#2ecc71',
  },
  buttonHover: {
    backgroundColor: '#2980b9',
  },
};

export default Home;

