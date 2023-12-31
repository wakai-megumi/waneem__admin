import React, { useState } from 'react';
import './AddUser.scss';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../utils/spinner/Spinner';

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
    const resizeImage = (file, maxWidth, maxHeight) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        resolve(blob);
                    },
                    file.type,
                    0.7
                );
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(file);
        });
    };
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        const resizedBlob = await resizeImage(file, 800, 600);

        const data = new FormData();
        data.append('file', resizedBlob);
        data.append('upload_preset', 'upload_hotel_booking');

        try {
            setLoading(true);
            const cancelToken = axios.CancelToken;
            const source = cancelToken.source();
            setUploadRequest(source);
            toast.info("may take a while please wait while it upload")
            if (data !== null && data !== undefined && data !== '') {
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_CLOUDINARY_URL}`,
                    data, {
                    cancelToken: source.token
                }
                );

                console.log(response);
                if (response?.data?.url) {
                    setFormData((prevData) => ({
                        ...prevData,
                        profileimage: response.data.url,
                    }));
                }
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
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        if (
            // formData.profileimage === '' ||
            // formData.profileimage === undefined ||                   // can set profile image lates also
            // formData.profileimage === null ||
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
                setLoading(true)
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/auth/register`,
                    formData,
                    { withCredentials: true }
                );
                setLoading(false)
                toast.success('User added successfully');
                navigate('/admin-dashboard/users')
            } catch (err) {
                console.log(err);
                setLoading(false)
                if (err.response.data.message === `User with email ${formData.username} already exists`) {

                    toast.error(err.response.data.message)
                }
            }
        };
    }
    //image take too long so we can cancel the image upload
    const cancelImageUpload = () => {
        if (uploadRequest) {
            uploadRequest.cancel('Image upload canceled by user');
        }
    };
    return (
        <div className="add-user-wrapper">
            <h2>Add New User</h2>
            <form className="add-user-container" onSubmit={handleSubmit}>
                {/* <h2> Add New User</h2> */}
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
                        <div className="placeholder">{
                            loading ? <Spinner /> : "Image Placeholder"
                        }


                        </div>
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
                            disabled={loading}
                        />
                    </div>
                    <button type="button" onClick={cancelImageUpload}>Cancel Upload</button>
                </div>
                <button type="submit" disabled={loading}>
                    Submit
                </button>
            </form>
        </div>

    );


}
export default AddUser;
