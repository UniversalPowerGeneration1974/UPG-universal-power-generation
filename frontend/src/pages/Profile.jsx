import React, { useState, useEffect } from 'react';
import api from '../config/api';
import './Profile.css';

function Profile({ currentUser, onProfileUpdate }) {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    fullname: '',
    phone: '',
    company: '',
    location: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Compress image using canvas
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize if too large
        if (width > 400) {
          height = (height * 400) / width;
          width = 400;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed base64
        const compressedImage = canvas.toDataURL('image/jpeg', 0.6);
        setProfile(prev => ({
          ...prev,
          avatar: compressedImage
        }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    loadProfile();
  }, [currentUser?.id]);

  useEffect(() => {
    // Trigger refresh when profile is updated
    if (currentUser?.avatar && profile.avatar !== currentUser.avatar) {
      setProfile(prev => ({
        ...prev,
        avatar: currentUser.avatar
      }));
    }
  }, [currentUser?.avatar]);

  const loadProfile = async () => {
    try {
      const response = await api.get(`/users/${currentUser.id}`);
      setProfile(response.data);
    } catch (err) {
      showMessage('Failed to load profile', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put(`/users/${currentUser.id}`, {
        fullname: profile.fullname,
        phone: profile.phone,
        company: profile.company,
        location: profile.location,
        avatar: profile.avatar
      });

      if (response.data.success) {
        showMessage('Profile updated successfully!', 'success');
        // Update App component's user state
        if (onProfileUpdate) {
          onProfileUpdate({
            ...currentUser,
            avatar: profile.avatar,
            fullname: profile.fullname,
            phone: profile.phone,
            company: profile.company,
            location: profile.location
          });
        }
        // Reload profile after a short delay to ensure database is updated
        setTimeout(() => loadProfile(), 500);
      }
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const getInitials = () => {
    return (profile.fullname || profile.username).substring(0, 2).toUpperCase();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {message && <div className={`message ${messageType}`}>{message}</div>}
        
        <div className="profile-header">
          <div className="profile-avatar">
            {profile.avatar ? (
              <img src={profile.avatar} alt="Profile Avatar" className="avatar-image" />
            ) : (
              <div className="avatar-circle">{getInitials()}</div>
            )}
          </div>
          <h2>{profile.fullname || profile.username}</h2>
        </div>

        <div className="profile-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username:</label>
              <input
                type="text"
                value={profile.username}
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={profile.email}
                disabled
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Profile Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                name="fullname"
                value={profile.fullname}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label>Company:</label>
              <input
                type="text"
                name="company"
                value={profile.company}
                onChange={handleChange}
                placeholder="Enter your company"
              />
            </div>

            <div className="form-group">
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="Enter your location"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
