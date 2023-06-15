import React, { useEffect } from 'react';
import './Users.scss';
import useFetch from "../../customhooks/useFetch"
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import noavatar from '../../assets/noavatar.jpg'
const Users = () => {
    const [UserData, setUserData] = React.useState([])
    const { data, error, loading, refetch } = useFetch(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/user/all`)
    ///-make it more dynamic --  in future if  have time -- like have env variable for this
    const noavatarAlt = 'Image by pikisuperstar -- www.freepik.com'    //--constant for noavatar image alt
    useEffect(() => {
        if (data) {
            setUserData(data)
        }
    }, [data])

    const handleUserDelete = async (id) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/user/delete/${id}`, {
                withCredentials: true,
            })
            if (response?.data?.success === true) {
                refetch()
            }
        } catch (err) {
            console.log(err)
        }

    }
    const navigate = useNavigate()
    const handlenewuser = async () => {
        navigate('/admin-dashboard/adduser')

    }

    return (
        <div className="users-container">
            <div className='users-heading'>
                <h2>Add New User</h2>

                <button className="add-new-button" onClick={handlenewuser}>Add New</button>
            </div>
            <table className='user-details'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Country</th>
                        <th>City</th>
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
                            <td colSpan="7">Error</td>
                        </tr>
                    ) : (
                        UserData && UserData?.users?.map(user => (
                            < tr className='user-row ' key={user._id} >
                                {console.log(user)}
                                <td>{user._id}</td>
                                <td className='image'>
                                    {user.profileimage ? (
                                        <img src={user.profileimage} alt="User" className="user-image" />
                                    ) : (
                                        <img src={noavatar} alt={noavatarAlt} className="user-image" />
                                    )}
                                    {user.username}
                                </td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                                <td>{user.country}</td>
                                <td>{user.city}</td>
                                <td>
                                    <button className="view-button" onClick={() => navigate('/admin-dashboard/profile', { state: { user: user } })}>View</button>
                                    <button className="delete-button" onClick={() => handleUserDelete(user._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div >
    );
};

export default Users;
