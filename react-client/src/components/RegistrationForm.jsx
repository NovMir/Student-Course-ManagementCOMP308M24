import { useState } from "react";
import axios from 'axios';

function RegistrationForm() {
  // State for all fields in the User schema
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [program, setProgram] = useState('');
  const [role, setRole] = useState('student'); // Default is 'student'
  const [favoriteTopic, setFavoriteTopic] = useState('');
  const [technicalSkill, setTechnicalSkill] = useState('');
  const [courses, setCourses] = useState([]);

  // For handling success or error messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'admin' && !email.endsWith('@admin.com')) 
        {setError("only users with admin.com email can be registered as admin"); return;}

    try {
      // POST request to your Express endpoint (e.g. /users/register)
      await axios.post('/users/register', {
        studentNumber,
        password,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
        email,
        program,
        role,
        favoriteTopic,
        technicalSkill,
        courses, // if you want to send an array of course IDs
      });

      // If successful, you can show a success message or redirect
      setSuccess('Registration successful!');
      // Optionally clear the form
      setStudentNumber('');
      setPassword('');
      setFirstName('');
      setLastName('');
      setAddress('');
      setCity('');
      setPhoneNumber('');
      setEmail('');
      setProgram('');
      setRole('student');
      setFavoriteTopic('');
      setTechnicalSkill('');
      setCourses([]);
    } catch (err) {
      console.error(err);
      // Show a user-friendly message
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container my-4">
      <h2>Register</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* studentNumber */}
        <div className="mb-3">
          <label className="form-label">Student Number</label>
          <input
            type="text"
            className="form-control"
            value={studentNumber}
            onChange={(e) => setStudentNumber(e.target.value)}
            required
          />
        </div>

        {/* password */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* firstName */}
        <div className="mb-3">
          <label className="form-label">First Name</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        {/* lastName */}
        <div className="mb-3">
          <label className="form-label">Last Name</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        {/* address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        {/* city */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* phoneNumber */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="text"
            className="form-control"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        {/* email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* program */}
        <div className="mb-3">
          <label className="form-label">Program</label>
          <input
            type="text"
            className="form-control"
            value={program}
            onChange={(e) => setProgram(e.target.value)}
          />
        </div>

        {/* role */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* favoriteTopic */}
        <div className="mb-3">
          <label className="form-label">Favorite Topic</label>
          <input
            type="text"
            className="form-control"
            value={favoriteTopic}
            onChange={(e) => setFavoriteTopic(e.target.value)}
          />
        </div>

        {/* technicalSkill */}
        <div className="mb-3">
          <label className="form-label">Technical Skill</label>
          <input
            type="text"
            className="form-control"
            value={technicalSkill}
            onChange={(e) => setTechnicalSkill(e.target.value)}
          />
        </div>

        {/* courses (optional) */}
        <div className="mb-3">
          <label className="form-label">Courses (array of IDs)</label>
          <input
            type="text"
            className="form-control"
            placeholder='e.g. ["courseId1","courseId2"]'
            value={courses}
            onChange={(e) => setCourses(e.target.value.split(','))}
          />
          <small className="text-muted">
            Enter comma-separated course IDs if you want to assign them here
          </small>
        </div>

        <button type="submit" className="btn btn-primary">
          Register
        </button>
      </form>
    </div>
  );
}

export default RegistrationForm;

