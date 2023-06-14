import React, { useContext, useState, useEffect } from "react"
import { Authcontext } from "../context/Authcontext.jsx"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import noavatar from "../assets/noavatar.jpg"

import "./Profile.scss"
import { useLocation } from "react-router-dom"

const UserProfile = () => {
    const { currentUser } = useContext(Authcontext)
    const [loading, setLoading] = useState(true)
    const [loadingImage, setLoadingImage] = useState(true)
    const [updateSuccess, setUpdateSuccess] = useState(false)

    const noavatarAlt = "Image by pikisuperstar -- www.freepik.com"/////---------------noavatar alt

    /////all the id used in this page --
    const id = currentUser._id
    const location = useLocation()
    const user = location.state?.user
    console.log(user)
    ///////////////////////////

    const [userData, setUserData] = useState([
        {
            editing: false,
            label: "Profile Image",
            value: "",
            type: "file",
            id: "profileimage",
        },
        {
            editing: false,
            label: "Username",
            value: "",
            type: "text",
            id: "username",
        },
        {
            editing: false,
            label: "Email",
            value: "",
            type: "email",
            id: "email",
        },
        {
            editing: false,
            label: "Country",
            value: "",
            type: "text",
            id: "country",
        },
        {
            editing: false,
            label: "City",
            value: "",
            type: "text",
            id: "city",
        },
        {
            editing: false,
            label: "Address",
            value: "",
            type: "text",
            id: "address",
        },
        {
            editing: false,
            label: "Phone",
            value: "",
            type: "text",
            id: "phone",
        },
    ])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_REACT_CLIENT_URL}user/get/${user._id}`,
                    { withCredentials: true }
                )
                setUserData((prevData) =>
                    prevData.map((user) => ({
                        ...user,
                        value: response.data?.user[user.id] || "",
                    }))
                )

                setLoading(false)
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }

        fetchUserData()
    }, [id])

    const handleClick = (index) => {
        setUserData((prevData) => {
            const updatedData = [...prevData]
            const field = updatedData[index]
            field.editing = true
            return updatedData
        })
    }

    const handleInputChange = (index, value) => {
        setUserData((prevData) => {
            const updatedData = [...prevData]
            const field = updatedData[index]
            field.value = value
            return updatedData
        })
    }

    const handleSave = async (index) => {
        const field = userData[index]
        const { value: file } = field

        setUserData((prevData) => {
            const updatedData = [...prevData]
            const field = updatedData[index]
            field.editing = false
            return updatedData
        })

        if (field.type === "file" && file) {
            try {
                const uploadData = new FormData()
                uploadData.append("file", file)
                uploadData.append("upload_preset", "upload_hotel_booking")
                setLoadingImage(true)

                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/wakai-megumi/image/upload",
                    uploadData
                )

                const imageUrl = response.data.url
                // await deleteImage(userData[0].value);

                setUserData((prevData) => {
                    const updatedData = [...prevData]
                    const field = updatedData[index]
                    field.value = imageUrl
                    return updatedData
                })
                setLoadingImage(false)
            } catch (error) {
                console.log(error)
                setLoadingImage(false)
            }
        }
    }

    const handleSaveAll = async () => {
        try {
            setUpdateSuccess(true)
            const response = await axios.put(
                `http://localhost:3000/api/v1/user/update/${id}`,
                {
                    username: userData[1].value,
                    email: userData[2].value,
                    country: userData[3].value,
                    city: userData[4].value,
                    address: userData[5].value,
                    phone: userData[6].value,
                    profileimage: userData[0].value,
                },
                {
                    withCredentials: true,
                }
            )
            console.log(response)
            setTimeout(() => {
                setUpdateSuccess(false)
            }, 3000)
            const currentUser = JSON.parse(localStorage.getItem("currentUser"))
            console.log(currentUser)

            if (currentUser._id === response?.data?._id) {
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(response?.data?.user)
                )
            }

            console.log(response.data.user)
            toast.success("Profile updated successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            })
        } catch (error) {
            setUpdateSuccess(false)
            console.log(error)
        }
    }
    console.log(currentUser._id)
    console.log(updateSuccess)
    return (
        <div className="user">
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="wrapper">
                        <table>
                            <tbody>
                                {userData.map((user, index) => (
                                    <tr className="info-row" key={index}>
                                        <th className="info-label">{user.label}:</th>
                                        {user.editing ? (
                                            <>
                                                {user.id === "profileimage" ? (
                                                    <td className="info-value">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            disabled={loadingImage}
                                                            onChange={(e) =>
                                                                handleInputChange(index, e.target.files[0])
                                                            }
                                                        />
                                                    </td>
                                                ) : (
                                                    <td className="info-value">
                                                        <input
                                                            type={user.type}
                                                            value={user.value}
                                                            onChange={(e) =>
                                                                handleInputChange(index, e.target.value)
                                                            }
                                                        />
                                                    </td>
                                                )}

                                                <td>
                                                    <button
                                                        className="edit-button"
                                                        title="Save"
                                                        onClick={() => handleSave(index)}
                                                    >
                                                        Save
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                {user.type === "file" ? (
                                                    <td className="info-value">
                                                        {user.value !== "" ? (
                                                            <img
                                                                src={user.value}
                                                                alt="Profile"
                                                                className="profile-image"
                                                            />
                                                        ) : (
                                                            <img
                                                                src={noavatar}
                                                                alt={noavatarAlt}
                                                                className="profile-image"
                                                            />
                                                        )}
                                                    </td>
                                                ) : (
                                                    <td className="info-value">{user.value}</td>
                                                )}
                                                <td>
                                                    <button
                                                        className="edit-button"
                                                        title="Edit"
                                                        onClick={() => handleClick(index)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <button
                        className="button"
                        disabled={updateSuccess}
                        onClick={handleSaveAll}
                    >
                        Save
                    </button>
                </>
            )}
        </div>
    )
}

export default UserProfile
