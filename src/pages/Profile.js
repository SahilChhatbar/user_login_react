import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged, updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userDoc = doc(db, 'users', currentUser.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setDisplayName(userData.displayName || '');
          setBio(userData.bio || '');
        } else {
          await setDoc(userDoc, {
            displayName: '',
            bio: '',
          });
          setDisplayName('');
          setBio('');
        }

        setLoading(false);
      } else {
        navigate('/');
      }
    }, (error) => {
      setError('Failed to load profile data.');
      console.error('Error loading profile:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName });
      }

      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const userSnapshot = await getDoc(userDoc);

      if (!userSnapshot.exists()) {
        await setDoc(userDoc, {
          displayName: '',
          bio: '',
        });
      }

      await updateDoc(userDoc, { displayName, bio });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !currentPassword) {
      setError('Please enter both current and new password.');
      return;
    }

    try {
      const userCredential = auth.currentUser;
      const credentials = EmailAuthProvider.credential(userCredential.email, currentPassword);

      await reauthenticateWithCredential(userCredential, credentials);
      await updatePassword(userCredential, newPassword);
      setSuccess('Password updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      setError(`Failed to update password: ${err.message}`);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading profile data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Profile Page</h2>
      
      <p className="lead">Welcome, {displayName || user?.email}!</p>
      <p><strong>Bio:</strong> {bio ? bio : 'No bio available'}</p>

      <form onSubmit={handleUpdateProfile} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Display Name:</label>
          <input
            type="text"
            className="form-control"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Bio:</label>
          <textarea
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself"
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">Save Changes</button>
      </form>

      {success && <p className="alert alert-success">{success}</p>}
      
      <h3 className="mt-4">Update Password</h3>
      <form onSubmit={handleUpdatePassword}>
        <div className="mb-3">
          <label className="form-label">Current Password:</label>
          <input
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">New Password:</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter a new password"
          />
        </div>
        <button type="submit" className="btn btn-success">Update Password</button>
      </form>
    </div>
  );
};

export default Profile;
