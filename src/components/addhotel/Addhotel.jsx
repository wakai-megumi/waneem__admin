import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "../../utils/spinner/Spinner";
import useFetch from "../../customhooks/useFetch";
import "./Addhote.scss";

const AddHotel = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        type: "",
        adminId: "",
        city: "",
        country: "",
        distance: "",
        hotelLogo: "",
        photos: [],
        description: "",
        title: "",
        rooms: [],
        cheapestprice: "",
        featured: false,
    });
    const [Files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [cancelToken, setCancelToken] = useState(null);

    const { data, isPending, error } = useFetch(
        `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/all`
    );

    const distinctRooms =
        data &&
        Object.values(
            data?.rooms?.reduce((acc, room) => {
                acc[room.title] = room;
                return acc;
            }, {})
        );

    const user = JSON.parse(localStorage.getItem("currentUser"));
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === "checkbox" ? checked : value;
        setFormData((prevData) => ({
            ...prevData,
            [name]: fieldValue,
        }));
    };

    const handleImageSelect = async (e) => {
        const files = e.target.files;
        setFiles(Array.from(files));
    };

    const handleImageUpload = async () => {
        let list = [];

        if (Files.length === 0) {
            alert("Please select images");
            return;
        }

        setUploading(true);
        const cancelTokenSource = axios.CancelToken.source();
        setCancelToken(cancelTokenSource);

        try {
            list = await Promise.all(
                Files.map(async (file) => {
                    const resizedBlob = await resizeImage(file, 800, 600);
                    const formData = new FormData();
                    formData.append("file", resizedBlob, file.name);
                    formData.append("upload_preset", "upload_hotel_booking");

                    const response = await axios.post(
                        `${import.meta.env.VITE_REACT_CLOUDINARY_URL}`,
                        formData,
                        {
                            cancelToken: cancelTokenSource.token,
                        }
                    );

                    return response.data.url;
                })
            );

            setUploading(false);
            setFormData((prevData) => ({
                ...prevData,
                photos: list,
            }));
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log("Image upload canceled");
            } else {
                console.log(error);
                setUploading(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (uploading) { return }
        setFormData((prevData) => ({
            ...prevData,
            adminId: user._id,
        }));

        const requiredFields = [
            "name",
            "address",
            "type",
            "city",
            "country",
            "distance",
            "description",
            "title",
            "cheapestprice",
        ];

        const isFormIncomplete = requiredFields.some((field) => !formData[field]);
        console.log(formData)
        if (isFormIncomplete || formData.rooms.length === 0) {
            alert("Please enter all required details");
            return;
        }

        try {
            console.log(import.meta.env.VITE_REACT_SERVER_URL)
            const response = await axios.post(
                `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/new`,
                formData,
                {
                    withCredentials: true,
                }
            );

            console.log(response);
            alert("Hotel added successfully");
            // window.location.reload();
            navigate("/admin-dashboard/addhotel");
        } catch (err) {
            alert(err.response?.data?.message || "An error occurred");
            console.log(err);
        }
    };
    //////////////////////////////////////////////////
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

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        const resizedBlob = await resizeImage(file, 800, 600);
        const formData = new FormData();
        formData.append("file", resizedBlob, file.name);
        formData.append("upload_preset", "upload_hotel_booking");

        try {
            setUploading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_REACT_CLOUDINARY_URL}`,
                formData
            );

            const { url } = response.data;
            setFormData((prevData) => ({
                ...prevData,
                hotelLogo: url,
            }));

            setUploading(false);
        } catch (err) {
            console.log(err);
            setUploading(false);
        }
    };

    const handleRoomSelect = (e) => {
        const selectedRooms = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );

        setFormData((prevData) => ({
            ...prevData,
            rooms: [...selectedRooms],
        }));
    };

    const handlecancel = () => {
        cancelToken?.cancel();
        setUploading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <h2 style={{ textAlign: "center", margin: "1rem 0" }}>
                Create New Hotel
            </h2>
            {uploading && (
                <div>Uploading images... Please wait or cancel the upload.</div>
            )}
            <div className="add-hotel-container">
                <div className="column">
                    <div className="logo-section">
                        {formData.hotelLogo ? (
                            <div className="image">
                                <img
                                    src={formData.hotelLogo}
                                    alt="Uploaded"
                                    className="hotel-logo"
                                />
                            </div>
                        ) : (
                            <div className="placeholder">
                                {uploading ? <Spinner /> : "Hotel logo Placeholder"}
                            </div>
                        )}
                        <div className="upload-section">
                            <label htmlFor="logo-image-upload" className="upload-icon">
                                <i className="fas fa-upload"></i>
                            </label>
                            <input
                                type="file"
                                id="logo-image-upload"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                            />
                        </div>
                        <div className="cancel" ><button onClick={handlecancel} style={{ border: 'none', outline: 'none', padding: "5px", backgroundColor: "orange" }}> cancel upload</button></div>
                    </div>

                    <div className="hotel-photos">
                        {formData.photos.length !== 0 ? (
                            <div className="image">
                                <img
                                    src={formData.photos[0]}
                                    alt="Uploaded"
                                    className="hotel-photo"
                                />
                            </div>
                        ) : (
                            <div className="placeholder">
                                {uploading ? (
                                    <Spinner />
                                ) : (
                                    <>Hotel Images placeholder</>
                                )}
                            </div>
                        )}
                        <div className="upload-section">
                            <label htmlFor="hotel-image-upload" className="upload-icon">
                                <i className="fas fa-upload"></i>
                            </label>
                            <input
                                type="file"
                                id="hotel-image-upload"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                disabled={uploading}
                            />
                            <button
                                onClick={handleImageUpload}
                                style={
                                    uploading ? { cursor: "not-allowed" } : { cursor: "pointer" }
                                }
                                disabled={uploading}
                            >
                                Upload
                            </button>
                        </div>
                        <h6>Press & Hold Ctrl for selecting multiple images</h6>
                    </div>
                </div>
                <div className="column">
                    <div className="input-section">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
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
                            required
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="type">Type</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="description">Description</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-section checkbox">
                        <label htmlFor="featured">Featured</label>
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                        />
                    </div>
                    {isPending ? (
                        <div className="loading">Loading rooms...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="input-section">
                            <label htmlFor="rooms">Rooms</label>
                            <select
                                name="rooms"
                                id="rooms"
                                multiple
                                onChange={handleRoomSelect}
                            >
                                {distinctRooms.map((room) => (
                                    <option value={room._id} key={room._id}>
                                        {room.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
                <div className="column">
                    <div className="input-section">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
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
                            required
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
                            required
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="distance">Distance from city capital</label>
                        <input
                            type="number"
                            id="distance"
                            name="distance"
                            value={formData.distance}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="cheapestprice">Cheapest Price</label>
                        <input
                            type="number"
                            id="cheapestprice"
                            name="cheapestprice"
                            value={formData.cheapestprice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>
            </div>
            <button type="submit" className="submit-button" >
                Add Hotel
            </button>
        </form>
    );
};

export default AddHotel;
