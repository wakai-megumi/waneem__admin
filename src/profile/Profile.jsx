import React, { useContext, useState, useEffect } from "react";
import { Authcontext } from "../context/Authcontext.jsx";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import noavatar from "../assets/noavatar.jpg";
import Spinner from "../utils/spinner/Spinner.jsx";
import "./Profile.scss";
import { FaEdit } from 'react-icons/fa';

import { useLocation, useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { currentUser, dispatch } = useContext(Authcontext);
    const [loading, setLoading] = useState(true);
    const [loadingImage, setLoadingImage] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [uploadRequest, setUploadRequest] = useState(null);

    const noavatarAlt = "Image by pikisuperstar -- www.freepik.com"; /////---------------noavatar alt

    /////all the id used in this page --
    const id = currentUser._id;
    const location = useLocation();
    const user = location.state?.user;
    const userid = user?._id;
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
    ]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/user/get/${userid}`,
                    { withCredentials: true }
                );
                setUserData((prevData) =>
                    prevData.map((user) => ({
                        ...user,
                        value: response.data?.user[user.id] || "",
                    }))
                );

                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    const handleClick = (index) => {
        setUserData((prevData) => {
            const updatedData = [...prevData];
            const field = updatedData[index];
            field.editing = true;
            return updatedData;
        });
    };

    const handleInputChange = (index, value) => {
        setUserData((prevData) => {
            const updatedData = [...prevData];
            const field = updatedData[index];
            field.value = value;
            return updatedData;
        });
    };
    //image resizing function 

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

    const handleSave = async (index) => {
        const field = userData[index];
        const { value: file } = field;

        setUserData((prevData) => {
            const updatedData = [...prevData];
            const field = updatedData[index];
            field.editing = false;
            return updatedData;
        });

        if (field.type === "file" && file) {
            try {
                const uploadData = new FormData();
                const resizedblob = await resizeImage(file, 800, 600)

                uploadData.append("file", resizedblob);
                uploadData.append("upload_preset", "upload_hotel_booking");
                setLoadingImage(true);
                const cancelToken = axios.CancelToken;
                const source = cancelToken.source();
                setUploadRequest(source);
                const response = await axios.post(
                    "https://api.cloudinary.com/v1_1/wakai-megumi/image/upload",
                    uploadData
                );

                const imageUrl = response.data.url;

                setUserData((prevData) => {
                    const updatedData = [...prevData];
                    const field = updatedData[index];
                    field.value = imageUrl;
                    return updatedData;
                });
                setLoadingImage(false);
            } catch (err) {
                setLoadingImage(false);

                if (axios.isCancel(err)) {
                    console.log('Image upload canceled:', err.message);
                } else {
                    console.log(err);
                }
            }
        }
    };

    //image take too long so we can cancel the image upload
    const cancelImageUpload = () => {
        if (uploadRequest) {
            uploadRequest.cancel('Image upload canceled by user');
        }
    };
    const navigate = useNavigate();

    const handleSaveAll = async () => {
        try {
            setUpdateSuccess(true);
            const response = await axios.put(
                `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/user/update/${userid}`,
                {
                    username: userData[1].value,
                    email: userData[2].value,
                    country: userData[3].value,
                    city: userData[4].value,
                    address: userData[5].value,
                    phone: userData[6].value,
                    profileimage: userData[0].value,
                    id: userid,
                },
                {
                    withCredentials: true,
                }
            );
            console.log(response);
            setTimeout(() => {
                setUpdateSuccess(false);
            }, 3000);
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            console.log(currentUser);

            if (currentUser._id === response?.data?._id) {
                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(response?.data?.user)
                );
            }

            console.log(response?.data?.user);
            dispatch({ type: "LOGIN_SUCCESS", payload: { user: response?.data?.user } })
            toast.success("Profile updated successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            });
            navigate("/admin-dashboard/users");
        } catch (error) {
            setUpdateSuccess(false);
            console.log(error);
        }
    };

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            {loading ? (
                <Spinner fullScreen />
            ) : (
                <>
                    <div className="profilewrapper">
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
                                                            <>
                                                                {loadingImage ? (
                                                                    <Spinner />
                                                                ) : (
                                                                    <img
                                                                        src={user.value}
                                                                        alt="Profile"
                                                                        className="profile-image"
                                                                    />
                                                                )}
                                                            </>
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
                                                    {
                                                        user.id === "profileimage" ?
                                                            <>
                                                                {
                                                                    loadingImage ?
                                                                        <button type="button" onClick={cancelImageUpload}>Cancel Upload</button>
                                                                        :
                                                                        <button
                                                                            className="edit-button"
                                                                            title="Edit"
                                                                            onClick={() => handleClick(index)}
                                                                        >
                                                                            <FaEdit />
                                                                        </button>
                                                                }

                                                            </>
                                                            :
                                                            <button
                                                                className="edit-button"
                                                                title="Edit"
                                                                onClick={() => handleClick(index)}
                                                            >
                                                                <FaEdit />
                                                            </button>

                                                    }
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
                        style={{
                            fontSize: "1rem",
                            border: "none",
                            outline: "none",
                            padding: "5px",
                            backgroundColor: "green",
                            color: "white",
                            marginTop: "20px",
                        }}
                        disabled={updateSuccess || loadingImage}
                        onClick={handleSaveAll}
                    >
                        Save
                    </button>
                </>
            )}
        </div>
    );
}

export default UserProfile;