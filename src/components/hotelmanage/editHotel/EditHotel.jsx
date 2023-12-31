import React, { useEffect, useState } from "react"
import axios from "axios"
import { useLocation, useNavigate } from "react-router-dom"
import useFetch from "../../../customhooks/useFetch"
import "./EditHotel.scss"
import { FiUpload } from "react-icons/fi"
import { toast } from 'react-toastify';
import Spinner from "../../../utils/spinner/Spinner"

const EditHotel = () => {
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

    const location = useLocation()
    const { hotel } = location.state
    const [uploading, setUploading] = useState(false)
    const [Files, setFiles] = useState([])
    const [savainghotel, setSavinghotel] = useState(false)

    const navigate = useNavigate()

    const { data, isPending, error } = useFetch(
        `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/all`
    )

    useEffect(() => {
        setFormData((prevData) => ({ //use loop to iterate over the data
            ...prevData,
            name: hotel.name,
            address: hotel.address,
            type: hotel.type,
            city: hotel.city,
            country: hotel.country,
            distance: hotel.distance,
            hotelLogo: hotel.hotelLogo,
            description: hotel.description,
            title: hotel.title,
            rooms: hotel.rooms,
            cheapestprice: hotel.cheapestprice,
            featured: hotel.featured,
            adminId: hotel.adminId
        }))
    }, [hotel])

    const distinctRooms = data && Object.values(data?.rooms?.reduce((acc, room) => {
        acc[room.title] = room;
        return acc;
    }, {}));


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        const fieldValue = type === "checkbox" ? checked : value

        setFormData((prevData) => ({
            ...prevData,
            [name]: fieldValue,
        }))
    }
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
    const handleImageSelect = (e) => {                               // --------------------------------------------- commented out
        const files = e.target.files
        setFiles(Array.from(files))
    }
    console.log(formData)                                                   //  -------------------------------------------commented out

    const handleImageUpload = async (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (Files.length === 0) {                                             //------//-------------------------------------commented out
            return toast.error("Please select images")

        }

        setUploading(true)

        try {
            const list = await Promise.all(
                Files.map(async (file) => {
                    const resizedBlob = await resizeImage(file, 800, 600);

                    const formData = new FormData()
                    formData.append("file", resizedBlob, file.name)
                    formData.append("upload_preset", "upload_hotel_booking")

                    const response = await axios.post(
                        "https://api.cloudinary.com/v1_1/wakai-megumi/image/upload",
                        formData
                    )

                    const url = response.data.url
                    return url
                })
            )

            setFormData((prevData) => ({
                ...prevData,
                photos: list,
            }))
        } catch (err) {
            console.log(err)
        }

        setUploading(false)                                          //------------------------------------------- commented out
    }

    console.log(hotel._id)
    const handleSubmit = async (e) => {
        e.preventDefault()

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
        ]

        const hasEmptyFields = requiredFields.some((field) => !formData[field])

        if (hasEmptyFields) {
            return toast.error("Please enter all required details")

        }

        const formDataWithAdminId = {
            ...formData,
            _id: hotel._id,
        }
        console.log(formDataWithAdminId)


        try {
            setSavinghotel(true)
            const response = await axios.patch(
                `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/updatehotel`,
                formDataWithAdminId,
                {
                    withCredentials: true,
                }
            )
            setSavinghotel(false)
            toast.success(response?.data?.updatedHotel?.name + " has been updated")
            // Use navigate to navigate to a specific route after successful submission
            navigate("/admin-dashboard/hotels")
        } catch (err) {
            setSavinghotel(false)
            toast.error(err.response.data.message)
            console.log(err)
        }
    }

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0]
        console.log(file)
        const resizedBlob = await resizeImage(file, 800, 600);

        const formData = new FormData()
        formData.append("file", resizedBlob, file.name)
        formData.append("upload_preset", "upload_hotel_booking")

        try {
            setUploading(true)

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/wakai-megumi/image/upload",
                formData
            )

            const url = response.data.url

            setFormData((prevData) => ({
                ...prevData,
                hotelLogo: url,
            }))

            setUploading(false)
        } catch (err) {
            console.log(err)
            setUploading(false)
        }
    }

    const handleRoomSelect = (e) => {
        const selectedOptions = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        )
        const distinctOptions = [...new Set(selectedOptions)];
        setFormData((prevData) => ({
            ...prevData,
            rooms: [...distinctOptions],
        }))
        console.log(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="form">
            {uploading && <div>Loading, please wait... , can edit other details in the while</div>}
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
                                {uploading ? <Spinner /> : "Hotel Images here"}

                            </div>
                        )}
                        <div className="upload-section">
                            <label htmlFor="logo-image-upload" className="upload-icon">
                                <FiUpload />
                            </label>
                            <input
                                type="file"
                                id="logo-image-upload"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploading}
                            />
                        </div>
                    </div>

                    <div className="hotel-photos" >
                        {formData.photos.length !== 0 ? (
                            <div className="image">
                                <img
                                    src={formData.photos[0]}
                                    alt="Uploaded"
                                    className="hotel-photo"
                                />
                            </div>
                        ) : (
                            <div className="placeholder"> {
                                uploading ? <Spinner /> : "Hotel Images here"
                            }</div>
                        )}
                        <div className="upload-section">
                            <label htmlFor="hotel-image-upload" className="upload-icon" >
                                <FiUpload />
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
                                disabled={uploading}
                                style={
                                    uploading ? { cursor: "not-allowed" } : { cursor: "pointer" }
                                }
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
                        <div className="loading">Loading...</div>
                    ) : error ? (
                        <div className="error">{error}</div>
                    ) : (
                        <div className="input-section">
                            <label htmlFor="rooms">Rooms</label>
                            <select name="rooms" id="rooms" multiple onChange={handleRoomSelect}>
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
            <button type="submit" className="btn" disabled={savainghotel}>
                Submit
            </button>
        </form>
    )
}

export default EditHotel
