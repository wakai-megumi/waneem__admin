import React from "react";
import useFetch from "../../customhooks/useFetch";
import axios from "axios";
import "./Hotelmanagement.scss";
import { useNavigate } from "react-router-dom";
import nodata from "../../assets/no-photo.png";
import Spinner from "../../utils/spinner/Spinner";

const HotelsManagement = () => {
    const { data, error, isPending, refetch } = useFetch(
        `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/all`,
        {
            withCredentials: true,
        }
    );

    const noDataAlt =
        "No photo icons created by Those Icons - Flaticon --- www.freepik.com"; // -- alt tag for the image if no image is in the database

    const handleHotelDelete = async (id) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/delete/${id}`,
                {
                    withCredentials: true,
                }
            );
            if (response?.data?.success === true) {
                refetch();
            }
        } catch (err) {
            console.log(err);
        }
    };

    const navigate = useNavigate();

    const handleNewHotel = () => {
        navigate("/admin-dashboard/addhotel");
    };

    return (
        <div className="hotels-container">
            <div className="hotels-heading">
                <h2>HOTELS</h2>
                <button className="add-new-button" onClick={handleNewHotel}>
                    Add New
                </button>
            </div>
            <table className="hotel-details">
                <thead>
                    <tr>
                        <th>HOTEL_ID</th>
                        <th>NAME</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>City</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isPending || data?.hotels?.length === 0 ? (
                        // Skeleton loading effect for hotels
                        <>


                            <tr>
                                {
                                    data?.hotels?.length === 0 && <h1>No hotels in the database</h1>
                                }
                                <td colSpan="6">
                                    <Spinner />
                                </td>
                            </tr>
                        </>
                    ) : error ? (
                        <tr>
                            <td colSpan="6">{error?.response}please refresh the page</td>
                        </tr>
                    ) : (
                        data?.hotels?.map((hotel) => (
                            <tr className="hotel-row" key={hotel._id}>
                                <td>{hotel._id}</td>
                                <td className="image">
                                    {hotel.hotelLogo ? (
                                        <img
                                            src={hotel.hotelLogo}
                                            alt="Hotel"
                                            className="hotel-image"
                                        />
                                    ) : (
                                        <img
                                            src={nodata}
                                            alt={noDataAlt}
                                            className="hotel-image"
                                        />
                                    )}
                                    <p>{hotel.name}</p>
                                </td>
                                <td>{hotel.type}</td>
                                <td>{hotel.title}</td>
                                <td>{hotel.city}</td>
                                <td >
                                    <div className="btns">   <button
                                        className="view-button"
                                        onClick={() =>
                                            navigate("/admin-dashboard/hotel_profile", {
                                                state: { hotel },
                                            })
                                        }
                                    >
                                        View
                                    </button>
                                        <button
                                            className="delete-button"
                                            onClick={() => handleHotelDelete(hotel._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default HotelsManagement;
