// src/pages/UserPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { 
  FiEdit2, FiUser, FiMail, FiPhone, FiMapPin, 
  FiCalendar, FiSave, FiGithub, FiTwitter, FiLinkedin 
} from 'react-icons/fi';

// Vintage color palette
const colors = {
  primary: '#6B5E49',    // Deep brown
  secondary: '#8B7355',  // Medium brown
  accent: '#B49F7E',     // Gold
  border: '#D4C5B2',     // Light gold
  background: '#F5F1E8', // Cream
  surface: '#FDFAF5',    // Off-white
};

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    displayName: '',
    phoneNumber: '',
    address: '',
    birthDate: '',
    bio: '',
    interests: [],
    photoURL: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth,
      (currentUser) => {
        try {
          if (currentUser) {
            setUser(currentUser);
            setProfileData(prevData => ({
              ...prevData,
              displayName: currentUser.displayName || '',
              email: currentUser.email || ''
            }));
          } else {
            navigate('/login');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      setError(error.message);
      console.error('Error signing out:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      socialLinks: {
        ...prevData.socialLinks,
        [name]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName
      });
      setIsEditing(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;
  
      setIsLoading(true);
      const storage = getStorage();
      const photoRef = ref(storage, `profile-photos/${user.uid}/${file.name}`);
      
      await uploadBytes(photoRef, file);
      const photoURL = await getDownloadURL(photoRef);
      
      await updateProfile(auth.currentUser, { photoURL });
      await setDoc(doc(db, 'users', user.uid), {
        ...profileData,
        photoURL
      }, { merge: true });
      
      setProfileData(prev => ({ ...prev, photoURL }));
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state with vintage styling
  if (isLoading) {
    return (
      <div
        className="h-screen w-full flex items-center justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent"
            style={{ borderColor: colors.accent }}
          ></div>
          <p
            className="mt-4 font-serif text-lg"
            style={{ color: colors.primary }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }
  // Error state with vintage styling
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: colors.background }}>
        <div className="bg-white/80 backdrop-blur-sm border-2 rounded-lg p-6 max-w-md mx-4"
             style={{ borderColor: colors.border }}>
          <h2 className="font-serif text-xl mb-4" style={{ color: colors.primary }}>
            An Error Occurred
          </h2>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-4 px-4 py-2 rounded-md font-serif text-white"
            style={{ backgroundColor: colors.accent }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Custom Input Component with vintage styling
  const VintageInput = ({ icon: Icon, label, type = "text", name, value, onChange, disabled }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 font-serif text-sm" style={{ color: colors.secondary }}>
        {Icon && <Icon size={16} />}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-2 rounded-md border-2 transition-all duration-300
          disabled:cursor-not-allowed font-serif"
        style={{
          backgroundColor: disabled ? colors.background : colors.surface,
          borderColor: colors.border,
          color: colors.primary,
        }}
      />
    </div>
  );

  {/* Profile Picture */}
<div className="relative mx-auto">
  <div className="h-32 w-32 rounded-full border-4 bg-white 
                overflow-hidden"
       style={{ borderColor: colors.accent }}>
    {profileData.photoURL ? (
      <img 
        src={profileData.photoURL} 
        alt="Profile" 
        className="w-full h-full object-cover"
      />
    ) : (
      <FiUser size={48} style={{ color: colors.secondary }} 
              className="w-full h-full p-8" />
    )}
  </div>
  {isEditing && (
    <label className="absolute bottom-0 right-0 p-1 rounded-full 
                    cursor-pointer bg-white shadow-lg border-2"
           style={{ borderColor: colors.border }}>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />
      <FiEdit2 size={16} style={{ color: colors.secondary }} />
    </label>
  )}
</div>

  return (
    <div className="min-h-screen bg-vintage-background"
    style={{ 
        backgroundColor: colors.background,
        backgroundImage: `url("data:image/svg+xml,...")`,
         }}> 
      <div className="max-w-4xl mx-auto">
        {/* Main Profile Card */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden border-2"
             style={{ 
               borderColor: colors.border,
               boxShadow: '0 4px 20px rgba(171, 149, 119, 0.1)'
             }}>
          
          {/* Profile Header */}
          <div className="relative px-6 py-8 text-center border-b-2"
               style={{ 
                 borderColor: colors.border,
                 background: `linear-gradient(to right, ${colors.background}, ${colors.border})`
               }}>
            {/* Profile Picture */}
            <div className="mx-auto h-32 w-32 rounded-full border-4 bg-white 
                          flex items-center justify-center overflow-hidden"
                 style={{ borderColor: colors.accent }}>
              <FiUser size={48} style={{ color: colors.secondary }} />
            </div>

            {/* Name and Email */}
            <div className="mt-4">
              <h1 className="font-serif text-3xl" style={{ color: colors.primary }}>
                {profileData.displayName || 'Your Name'}
              </h1>
              <p className="mt-1 font-serif" style={{ color: colors.secondary }}>
                {user?.email}
              </p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
              className="mt-4 px-6 py-2 rounded-md font-serif text-sm 
                       flex items-center justify-center mx-auto gap-2
                       transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colors.surface,
                color: colors.secondary,
                border: `2px solid ${colors.accent}`
              }}
            >
              {isEditing ? (
                <>
                  <FiSave size={16} />
                  Save Changes
                </>
              ) : (
                <>
                  <FiEdit2 size={16} />
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="font-serif text-2xl border-b-2 pb-2"
                    style={{ color: colors.primary, borderColor: colors.border }}>
                  Personal Information
                </h2>
                <div className="space-y-4">
                  <VintageInput
                    icon={FiUser}
                    label="Full Name"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <VintageInput
                    icon={FiPhone}
                    label="Phone Number"
                    type="tel"
                    name="phoneNumber"
                    value={profileData.phoneNumber}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <VintageInput
                    icon={FiMapPin}
                    label="Address"
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <VintageInput
                    icon={FiCalendar}
                    label="Birth Date"
                    type="date"
                    name="birthDate"
                    value={profileData.birthDate}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
              </div>



              {/* Bio */}
              <div className="col-span-full space-y-4">
                <h2 className="font-serif text-2xl border-b-2 pb-2"
                    style={{ color: colors.primary, borderColor: colors.border }}>
                  Biography
                </h2>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border-2 font-serif
                            transition-all duration-300 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: isEditing ? colors.surface : colors.background,
                    borderColor: colors.border,
                    color: colors.primary
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-md font-serif
                           transition-all duration-300"
                  style={{
                    color: colors.secondary,
                    border: `2px solid ${colors.border}`
                  }}
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="px-6 py-2 rounded-md font-serif text-white
                         transition-all duration-300 hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, ${colors.secondary})`
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;