import React, { useState } from 'react';
import './index.css';

const LeadForm = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Send data to backend API (replace URL with your backend endpoint)
    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      console.log('Response:', response);
      if (response.ok) {
        setSubmitted(true);
        setForm({ name: '', email: '', company: '', message: '' });
      } else {
        setForm({ name: '', email: '', company: '', message: '' });
        alert('Failed to submit lead. Please try again.');
      }
    } catch (error) {
      alert('Error submitting lead.');
    }
  };

  return (
    <div className="lead-form-container">
      <h2>Lead Generation Form</h2>
      {submitted && <div className="success-message">Thank you! Your lead has been submitted.</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Name<span className="required">*</span></label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email<span className="required">*</span></label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default LeadForm;