import React, { useState } from 'react';
import './AddUser.scss';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';

const AddUser = () => {
    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        address: '',
        email: '',
        password: '',
        country: '',
        profileimage: '',
        isAdmin: false,
    });
    const [loading, setLoading] = useState(false);
    const [uploadRequest, setUploadRequest] = useState(null);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setFormData((prevData) => ({
            ...prevData,
            [name]: fieldValue,
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'upload_hotel_booking');

        try {
            setLoading(true);
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            setUploadRequest(source);
            if (data !== null && data !== undefined && data !== '') {
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_CLOUDINARY_URL}`,
                    data, {
                    cancelToken: source.token
                }
                );

                console.log(response);
                setFormData((prevData) => ({
                    ...prevData,
                    profileimage: response.data.url,
                }));
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                console.log('Image upload canceled:', err.message);
            } else {
                console.log(err);
            }
        }
        setLoading(false);

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (
            formData.profileimage === '' ||
            formData.profileimage === undefined ||
            formData.profileimage === null ||
            formData.username === '' ||
            formData.phone === '' ||
            formData.address === '' ||
            formData.email === '' ||
            formData.password === '' ||
            formData.country === ''
        ) {
            alert('Please provide all details');
        } else {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/register`,
                    formData,
                    { withCredentials: true }
                );
                console.log(response);
                alert('User added successfully');
            } catch (err) {
                console.log(err);
            }
        }
    };
    //image take too long so we can cancel the image upload
    const cancelImageUpload = () => {
        if (uploadRequest) {
            uploadRequest.cancel('Image upload canceled by user');
        }
    };

    return (
        <form className="add-user-container" onSubmit={handleSubmit}>
            <div className="form-column">
                <div className="input-section">
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-section">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-section">
                    <label htmlFor="country">Country</label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-section">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className="form-column">
                <div className="input-section">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-section">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-section">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>
                <div className="input-section">
                    <label htmlFor="isAdmin">Admin</label>
                    <input
                        type="checkbox"
                        id="isAdmin"
                        name="isAdmin"
                        checked={formData.isAdmin}
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div className="image-column">
                {formData.profileimage ? (
                    <img src={formData.profileimage} alt="Uploaded" className="user-image" />
                ) : (
                    <div className="placeholder">Image Placeholder</div>
                )}
                <div className="upload-section">
                    <label htmlFor="image-upload" className="upload-icon">
                        <FiUpload />
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>
                <button type="button" onClick={cancelImageUpload}>Cancel Upload</button>
            </div>
            <button type="submit" disabled={loading}>
                Submit
            </button>
        </form>
    );
};

export default AddUser;
