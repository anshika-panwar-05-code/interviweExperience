import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    country: '',
    name: '',
    questions: '',
  });

  // Fetch submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/submissions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSubmissions(response.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };

    fetchSubmissions();
  }, []);

  // Delete submission
  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubmissions(submissions.filter((submission) => submission._id !== id));
    } catch (err) {
      console.error('Error deleting submission:', err);
    }
  };

  // Edit submission
  const handleEdit = (submission) => {
    setEditId(submission._id);
    setFormData({
      company: submission.company,
      country: submission.country,
      name: submission.name,
      questions: submission.questions.join(', '),  
    });
  };

  // Save edited submission
  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/submissions/${editId}`,
        {
          ...formData,
          questions: formData.questions.split(',').map((q) => q.trim()), 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the state with the edited submission
      setSubmissions(submissions.map((submission) =>
        submission._id === editId ? { ...submission, ...formData, questions: formData.questions.split(',').map(q => q.trim()) } : submission
      ));
      setEditId(null); 
    } catch (err) {
      console.error('Error saving submission:', err);
    }
  };

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
      <h2>Your Interview Submissions</h2>
      {submissions.length === 0 ? (
        <p>No submissions yet!</p>
      ) : (
        <ul>
          {submissions.map((submission) => (
            <li key={submission._id}>
              {editId === submission._id ? (
                <div>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Company"
                  />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Name"
                  />
                  <input
                    type="text"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    placeholder="Interview Questions (comma separated)"
                  />
                  <button onClick={handleSave}>Save</button>
                </div>
              ) : (
                <div>
                  <h3>{submission.company} - {submission.country}</h3>
                  <p>{submission.name}</p>
                  <div>
                    <strong>Interview Questions:</strong>
                    <ul>
                      {submission.questions.map((question, index) => (
                        <li key={index}>{question}</li>
                      ))}
                    </ul>
                  </div>
                  <button onClick={() => handleEdit(submission)}>Edit</button>
                  <button onClick={() => handleDelete(submission._id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Submissions;
