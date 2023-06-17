import React, { useState } from 'react';
import './AddRoom.scss';
import axios from 'axios';
import { toast } from 'react-toastify';
import useFetch from '../../customhooks/useFetch'
const Addroom = () => {
    const [formData, setFormData] = useState({
        title: '',
        desc: '',
        price: '',
        maxpeople: '',
        roomNumbers: [],


    });
    const [loading, setLoading] = useState(false)
    const [hotelId, setHotelId] = useState('')
    const [roomNumbers, setRoomNumbers] = useState([])
    const { data, error, isPending, refetch } = useFetch(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/hotels/all`, {
        withCredentials: true,
    })
    console.log(data)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };


    console.log(hotelId)

    const handleroomNumbersChange = (e) => {
        const { value } = e.target;
        const number = value.split(',')
        console.log(number)

        setRoomNumbers(number)

    }
    const handlesubmit = async (e) => {
        e.preventDefault();
        setFormData((prevData) => ({

            ...prevData,
            roomNumbers: roomNumbers.map(num => {
                const numb = parseInt(num)
                return {
                    number: numb
                }
            })
        }))
        console.log(formData)


        if (formData.title === "" || formData.desc === '' || formData.hotelId === '' || formData.price === '' || formData.maxpeople === '' || formData.roomNumbers.length === 0 || hotelId === '') {
            toast.error("please fill all the fields")
        }
        else {
            try {

                setLoading(true)
                const response = await axios.post(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/room/${hotelId}`, formData, { withCredentials: true })
                console.log(response)
                toast.success("room added successfully")
                setLoading(false)
            } catch (err) {
                console.log(err)
                setLoading(false)
            }
        }

    };


    return (
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
                    <select htmlFor="hotel-id" className='selecthotelid' placeholder='choose below' onChange={(e) => { setHotelId(e.target.value) }}>
                        <option>choose hotel</option>
                        {
                            data && data?.hotels.map(hotel => {
                                return (<option key={hotel._id} value={hotel._id}>{hotel.name}</option>)
                            })
                        }
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
                    <label htmlFor="roomnumber" className='roomnumberinput'>Room Numbers</label>
                    <textarea
                        placeholder='Enter room numbers(use "," to separate the room numbers)'
                        id="roonumber"
                        type="number"
                        className='roomnumber'
                        name="price"
                        value={roomNumbers}
                        onChange={handleroomNumbersChange}
                    />
                </div>
                <button type='submit' className='btn' disabled={loading}> submit</button>

            </div>
        </form>
    );
};

export default Addroom;
