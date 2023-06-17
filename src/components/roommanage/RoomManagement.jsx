import React from "react";
import useFetch from "../../customhooks/useFetch";
import axios from "axios";
import "./RoomManagement.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RoomManagement = () => {
    const { data, error, loading, refetch } = useFetch(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/all`)
    console.log(data)
    const handleUserDelete = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/delete/${id}`, {        // this is room id
                withCredentials: true,
            })
            console.log(response.data)
            console.log(response.data.success === true)
            toast.success("successfully deleted the room from the database and associated hotel")
            if (response?.data?.success === true) {
                refetch()
            }
        } catch (err) {
            console.log(err)
        }


    }
    const navigate = useNavigate()
    return (
        <div className="rooms-container">
            <div className='rooms-heading'>
                <h2> Rooms</h2>
                <button className="add-new-button" onClick={() => navigate('/admin-dashboard/addroom')}>Add New</button>
            </div>
            <table className='room-details'>
                <thead>
                    <tr>
                        <th>ROOM_ID</th>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Maxpeople</th>
                        <th>Total_rooms</th>
                        <th>Room_Numbers</th>
                        <th>Action</th>


                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="7">Loading...</td>
                        </tr>
                    ) : error ? (
                        <tr>
                            <td colSpan="7"> {error.response?.data?.message}please refresh the page</td>
                        </tr>
                    ) : data?.rooms.length === 0 ? (
                        <div>no rooms in the database</div>
                    )

                        :


                        (
                            data && data?.rooms?.map(room => (
                                <tr className='room-row ' key={room._id}>
                                    <td>{room._id}</td>
                                    {/* <td className='image'>                              --- advance feature like showing the rooms images also
                                    {room.roomimages ? (
                                        <img src={room.profileimage} alt="room" className="room-image" />
                                    ) : (
                                        <img src={noavatar} alt="room" className="room-image" />
                                    )}
                                    {room.name}
                                </td> */}
                                    <td>{room.title}</td>
                                    <td>{room.price}</td>
                                    <td>{room.maxpeople}</td>
                                    <td>{room.roomNumbers.length}</td>
                                    <td>{
                                        room.roomNumbers.map((roomNumber, index) => (
                                            <div key={index}>{roomNumber.number}</div>
                                        ))

                                    }</td>

                                    <td>
                                        <button className="view-button"  >View</button>
                                        <button className="delete-button" onClick={() => handleUserDelete(room._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                </tbody>
            </table>
        </div>
    );
};


export default RoomManagement;