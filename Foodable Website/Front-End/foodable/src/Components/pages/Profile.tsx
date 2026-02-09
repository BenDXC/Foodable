import React, { useState, FormEvent, ChangeEvent } from "react";
import "./cssFiles/Profile.css";
import "./cssFiles/CreateDonation.css";
import { SetUserProps } from "../../types";
import UserSidebar from "../shared/UserSidebar";

interface ProfileFormData {
  firstName?: string;
  lastName?: string;
  postcode?: string;
  email?: string;
}

export default function ProfilePage(props: SetUserProps): JSX.Element {
  // TODO: Get username from context/props
  const username = "User"; // Replace with actual user data

  return (
    <div className="profilecontainer">
      <UserSidebar username={username} />
      <Profile />
    </div>
  );
}

function Profile(): JSX.Element {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: 'John',
    lastName: 'Doe',
    postcode: 'SL6 1TJ',
    email: 'johndoe@gmail.com',
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: API call to update profile
      console.log('Updating profile:', formData);
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="editprofile">
        <h1 className="mtitle">Edit Profile</h1>
        <br />
        <div className="row">
          {/* left column */}
          <div className="text-center">
            <img src="Img/foodable1mini.jpg" className="avatar" alt="avatar" />
            <h4 className="cpp">Change profile picture</h4>
            <input type="file" className="imagebtn" accept="image/*" />
          </div>
        </div>
        {/* edit form column */}
        <h3 className="pititle">Personal info</h3>
        <form className="Profile-Form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="fnlabel">First name:</label>
            <div className="col-lg-8">
              <input 
                className="form-control" 
                type="text" 
                name="firstName"
                value={formData.firstName || ''} 
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-3 control-label">Last name:</label>
            <div className="col-lg-8">
              <input 
                className="form-control" 
                type="text" 
                name="lastName"
                value={formData.lastName || ''} 
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-3 control-label">Postcode:</label>
            <div className="col-lg-8">
              <input
                className="form-control"
                type="text"
                name="postcode"
                value={formData.postcode || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="col-lg-3 control-label">Email:</label>
            <div className="col-lg-8">
              <input
                className="form-control"
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-lg-8"></div>
          </div>
          <button type="submit" className="sub-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Confirm changes'}
          </button>
        </form>
      </div>
    </>
  );
}
