import  { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

import Header from '../../components/shared/Header';
import Footer from '../../components/shared/Footer';
import StudentNavbar from '../../components/student/StudentNavbar';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const Profile = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const { loading, setLoading, error, setError, showNotification } = useApp();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        phoneNumber: currentUser.phoneNumber || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation (only if user is trying to change password)
    if (formData.newPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword && formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      // Only send necessary fields
      const dataToUpdate = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city
      };
      
      // Add password fields if user is changing password
      if (formData.newPassword && formData.currentPassword) {
        dataToUpdate.currentPassword = formData.currentPassword;
        dataToUpdate.newPassword = formData.newPassword;
      }
      
      const updatedUser = await updateStudentProfile(currentUser._id, dataToUpdate);
      
      // Update local user state
      setCurrentUser(updatedUser);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setEditMode(false);
      showNotification('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile: ' + (err.message || 'Unknown error'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <StudentNavbar />
      
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">
              View and update your personal information
            </p>
          </div>
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <Card>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              {!editMode && (
                <Button 
                  variant="primary" 
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="studentNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Student Number
                  </label>
                  <input
                    type="text"
                    id="studentNumber"
                    value={currentUser?.studentNumber || ''}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Student number cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                    Program
                  </label>
                  <input
                    type="text"
                    id="program"
                    value={currentUser?.program || ''}
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                    disabled
                  />
                  <p className="mt-1 text-xs text-gray-500">Contact administration to change program</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      formErrors.firstName ? 'border-red-500' : 'border-gray-300'
                    } ${!editMode && 'bg-gray-100'}`}
                    disabled={!editMode}
                    required
                  />
                  {formErrors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      formErrors.lastName ? 'border-red-500' : 'border-gray-300'
                    } ${!editMode && 'bg-gray-100'}`}
                    disabled={!editMode}
                    required
                  />
                  {formErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  } ${!editMode && 'bg-gray-100'}`}
                  disabled={!editMode}
                  required
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full p-2 border border-gray-300 rounded-md ${!editMode && 'bg-gray-100'}`}
                    disabled={!editMode}
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full p-2 border border-gray-300 rounded-md ${!editMode && 'bg-gray-100'}`}
                    disabled={!editMode}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-2 border border-gray-300 rounded-md ${!editMode && 'bg-gray-100'}`}
                  disabled={!editMode}
                />
              </div>
              
              {editMode && (
                <>
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-4">Leave blank if you don't want to change your password</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className={`w-full p-2 border rounded-md ${
                            formErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.currentPassword}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className={`w-full p-2 border rounded-md ${
                            formErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {formErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.newPassword}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full p-2 border rounded-md ${
                          formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {formErrors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      onClick={() => {
                        setEditMode(false);
                        setFormErrors({});
                        // Reset form to current user data
                        if (currentUser) {
                          setFormData({
                            firstName: currentUser.firstName || '',
                            lastName: currentUser.lastName || '',
                            email: currentUser.email || '',
                            phoneNumber: currentUser.phoneNumber || '',
                            address: currentUser.address || '',
                            city: currentUser.city || '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;