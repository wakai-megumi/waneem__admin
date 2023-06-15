import React from "react";
import useFetch from "../../customhooks/useFetch";
import axios from "axios";
import "./Hotelmanagement.scss";
import { useNavigate } from "react-router-dom";
import nodata from "../../assets/no-photo.png"

const HotelsManagement = () => {

    const { data, error, isPending, refetch } = useFetch(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/all`, {
        withCredentials: true,
    })
    const noDataAlt = "No photo icons created by Those Icons - Flaticon --- www.freepik.com" // -- alt tag for the image if no image i`n the database 

    console.log(data)
    const handleHotelDelete = async (id) => {

        try {
            console.log('here')
            const response = await axios.delete(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/delete/${id}`, {
                withCredentials: true,
            })
            console.log(response.data.success === true)
            if (response?.data?.success === true) {
                refetch()
            }
        } catch (err) {
            console.log(err)
        }

    }
    const navigate = useNavigate()
    const handlenewhotel = async () => {
        navigate('/admin-dashboard/addhotel')
    }
    console.log(error)

    return (
        <div className="hotels-container">
            <div className='hotels-heading'>
                <h2>Add New Hotel</h2>
                <button className="add-new-button" onClick={handlenewhotel}>Add New</button>
            </div>
            <table className='hotel-details'>
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
                    {isPending ? (
                        <tr>
                            <td colSpan="7">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="7">Error</td>
                        </tr>
                    ) : (
                        data && data?.hotels?.map(hotel => (

                            <tr className='hoetl-row ' key={hotel._id}>
                                <td>{hotel._id}</td>
                                <td className='image'>
                                    {hotel.hotelLogo ? (
                                        <img src={hotel.hotelLogo} alt="Hotel" className="hotel-image" />
                                    ) : (
                                        <img src={nodata} alt={noDataAlt} className="hotel-image" />
                                    )}
                                    <p> {hotel.name}</p>

                                </td>
                                <td>{hotel.type}</td>
                                <td>{hotel.title}</td>
                                <td>{hotel.city}</td>
                                <td className="btns">
                                    {/* sending the whole hotel data , saving our api req, only when we edit something then only need to have api call */}
                                    <button className="view-button" onClick={() => navigate('/admin-dashboard/hotel_profile', { state: { hotel } })}>View</button>

                                    <button className="delete-button" onClick={() => handleHotelDelete(hotel._id)}>Delete</button>
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