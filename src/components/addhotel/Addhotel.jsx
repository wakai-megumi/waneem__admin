import React, { useContext, useEffect, useState } from "react"
import "./Addhote.scss"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useFetch from "../../customhooks/useFetch"
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
    })
    const [Files, setFiles] = useState([])
    const [uploading, setuploading] = useState(false)
    const { data, isPending, error } = useFetch(
        `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/all`
    )
    console.log(data)
    const distinctRooms = data && Object.values(
        data?.rooms?.reduce((acc, room) => {
            acc[room.title] = room;
            return acc;
        }, {})
    );

    const { user } = JSON.parse(localStorage.getItem("currentUser"))
    console.log(user._id)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const fieldvalue = type === "checkbox" ? checked : value
        setFormData((prevData) => ({
            ...prevData,
            [name]: fieldvalue,
        }))
    }
    const handleImageSelect = async (e) => {
        const files = e.target.files
        setFiles(Array.from(files))
    }
    const handleImageUpload = async () => {
        let list = []
        if (Files.length !== 0) {
            setuploading(true)
            list = await Promise.all(
                Files.map(async (file) => {
                    const formdata = new FormData()
                    formdata.append("file", file, file.name)
                    formdata.append("upload_preset", "upload_hotel_booking")
                    console.log(formdata.getAll("file"))
                    const res = await axios.post(
                        `${import.meta.env.VITE_REACT_CLOUDINARY_URL}`,
                        formdata
                    )
                    const url = await res.data.url

                    return url
                })
            )
        } else {
            return alert("please select images")
        }

        try {
            setFormData((prevData) => ({
                ...prevData,
                photos: list,
            }))
            setuploading(false)
        } catch (err) {
            console.log(err)
            setuploading(false)
        }
    }

    console.log(formData)
    console.log(uploading)
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        setFormData((prev) => {
            return {
                ...prev,
                adminId: user._id,
            }
        })
        if (
            formData.name === "" ||
            formData.address === "" ||
            formData.type === "" ||
            formData.city === "" ||
            formData.country === "" ||
            formData.distance === "" ||
            formData.description === "" ||
            formData.title === "" ||
            formData.cheapestprice === "" ||
            formData.rooms.length === 0
        ) {
            alert("Please enter all required details")
        } else {
            try {
                console.log(formData)
                const response = await axios.post(
                    `${import.meta.env.VITE_REACT_CLIENT_URL}hotels/new`,
                    formData,
                    {
                        withCredentials: true,
                    }
                )
                console.log(response)
                alert("Hotel added successfully")
                window.location.reload()
                history.replace("/admin-dashboard/hotels")
            } catch (err) {
                alert(err.response.data.message)
                console.log(err)
            }
        }
    }

    const handlelogoupload = async (e) => {
        const file = e.target.files[0]
        const data = new FormData()

        data.append("file", file, file.name)
        data.append("upload_preset", "upload_hotel_booking")
        try {
            setuploading(true)
            const res = await axios.post(
                `${import.meta.env.VITE_REACT_CLOUDINARY_URL}`,
                data
            )
            const { url } = res.data

            console.log(url)
            setFormData((prevData) => ({
                ...prevData,
                hotelLogo: url,
            }))
            setuploading(false)
        } catch (err) {
            console.log(err)
            setuploading(false)
        }
    }
    const handleselect = (e) => {
        const data = Array.from(e.target.selectedOptions, (option) => option.value)
        setFormData({
            ...formData,
            rooms: [...data],
        })
    }
    console.log(formData)
    return (

        <form onSubmit={handleSubmit} className="form">
            {
                uploading && <div > loading please wait -- fill the other details till then</div>
            }
            <div className="add-hotel-container">
                <div className="column">
                    <div className="logo-section">
                        {formData.hotelLogo ? (
                            <div className="image">
                                {" "}
                                <img
                                    src={formData.hotelLogo}
                                    alt="Uploaded"
                                    className="hotel-logo"
                                />{" "}
                            </div>
                        ) : (
                            <div className="placeholder">Hotel logo Placeholder</div>
                        )}
                        <div className="upload-section">
                            <label htmlFor="logo-image-upload" className="upload-icon">
                                <i className="fas fa-upload"></i>
                            </label>
                            <input
                                type="file"
                                id="logo-image-upload"
                                accept="image/*"
                                onChange={handlelogoupload}
                                disabled={uploading}
                            />
                        </div>
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
                            <div className="placeholder"> Hotel images</div>
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
                                upload
                            </button>
                        </div>
                        <h6> Press & Hold Ctrl for selectig multiple inputs</h6>
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
                        <label htmlFor="type">Description</label>
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
                            value={formData.country}
                            onChange={handleChange}
                        />
                    </div>
                    {isPending ? (
                        <div className="loading">loading ..... </div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="input-section ">
                            <label htmlFor="featured">Rooms</label>
                            <select name="rooms" id="rooms" multiple onChange={handleselect}>
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
                        <label htmlFor="type">Title</label>
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
                        <label htmlFor="distance">Distance from city capital </label>
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
                        <label htmlFor="distance">Cheapestprice</label>
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
            <button type="submit" className="btn">
                submit
            </button>
        </form>
    )
}
export default AddHotel
