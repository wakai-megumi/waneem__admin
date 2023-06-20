import React, { useState } from 'react';
import './AddRoom.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import useFetch from '../../customhooks/useFetch';
import { useNavigate } from 'react-router-dom';
import propTypes from 'prop-types';
import { motion } from 'framer-motion';

const Addroom = ({ handleBufferingTimeoutError }) => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        price: '',
        maxpeople: '',
        roomNumbers: [],
        hotelId: '',
    });
    const [loading, setLoading] = useState(false);
    const [hotelId, setHotelId] = useState('');
    const [roomNumbers, setRoomNumbers] = useState([]);
    const { data, error, isPending, refetch } = useFetch(
        `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/all`,
        {
            withCredentials: true,
        }
    );
    const navigate = useNavigate();
    console.log(data);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        console.log(name, value);
    };

    const handleroomNumbersChange = (e) => {
        const { value } = e.target;
        const number = value.split(',');
        console.log(number);

        setRoomNumbers(number);
    };

    const handlesubmit = async (e) => {
        e.preventDefault();

        setFormData((prevData) => ({
            ...prevData,
            roomNumbers: roomNumbers.map((num) => ({
                number: parseInt(num),
            })),
        }));

        formData.hotelId = hotelId;
        console.log(formData);

        if (
            formData.title === '' ||
            formData.desc === '' ||
            formData.hotelId === '' ||
            formData.price === '' ||
            formData.maxpeople === '' ||
            formData.roomNumbers.length === 0
        ) {
            toast.error('Please fill all the fields');
        } else {
            try {
                setLoading(true);
                await axios.post(
                    `${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/createRoom`,
                    formData,
                    { withCredentials: true }
                );
                setLoading(false);

                toast.success('Room added successfully');
                navigate('/admin-dashboard/room');
            } catch (err) {
                if (
                    err?.response?.data?.message ===
                    'Operation rooms.insertOne() buffering timed out after 10000ms'
                ) {
                    handleBufferingTimeoutError(err);
                } else {
                    toast.error(err?.response?.data?.message);
                }
                setLoading(false);
            }
        }
    };

    return (
        <motion.div
            className="add-room-wrapper"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Add New Room</h2>
            <form className="add-room-container" onSubmit={handlesubmit}>
                <div className="column">
                    <div className="input-section">
                        <label htmlFor="title">Title</label>
                        <input
                            type="title"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="desc">Description</label>
                        <input
                            type="text"
                            id="desc"
                            name="desc"
                            value={formData.desc}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-section">
                        <select
                            id="hotelId"
                            className="selecthotelid"
                            placeholder="Choose below"
                            onChange={(e) => {
                                setHotelId(e.target.value);
                            }}
                        >
                            <option>Choose hotel</option>
                            {data &&
                                data?.hotels.map((hotel) => {
                                    return (
                                        <option key={hotel._id} value={hotel._id}>
                                            {hotel.name}
                                        </option>
                                    );
                                })}
                        </select>
                    </div>
                </div>
                <div className="column">
                    <div className="input-section">
                        <label htmlFor="maxpeople">Max People</label>
                        <input
                            type="number"
                            id="maxpeople"
                            name="maxpeople"
                            value={formData.maxpeople}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="input-section">
                        <label htmlFor="roomnumber" className="roomnumberinput">
                            Room Numbers
                        </label>
                        <textarea
                            placeholder="Enter room numbers (use ',' to separate the room numbers)"
                            id="roonumber"
                            type="number"
                            className="roomnumber"
                            name="price"
                            value={roomNumbers}
                            onChange={handleroomNumbersChange}
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="btn"
                        disabled={loading}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Submit
                    </motion.button>
                </div>
            </form>
        </motion.div>
    );
};

export default Addroom;

Addroom.propTypes = {
    handleBufferingTimeoutError: propTypes.func.isRequired,
};
