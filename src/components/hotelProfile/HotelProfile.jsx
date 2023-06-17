import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "./HotelProfile.scss";
import { FaMapMarkerAlt } from "react-icons/fa";

const HotelProfile = () => {
    const location = useLocation();
    const { hotel } = location.state;
    const [isLoading, setIsLoading] = useState(true);
    const [openGallery, setOpenGallery] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const openImageGallery = (index) => {
        setCurrentImage(index);
        setOpenGallery(true);

    };

    const closeImageGallery = () => {
        setOpenGallery(false);
    };
    const navigate = useNavigate()
    console.log(hotel)
    const handleHotelEdit = () => {

        return (
            navigate('edithotel', { state: { hotel } })
        )

    }


    return (
        <div className="hotel">
            <div className="hotel_container">
                <div className="hotel_info_section">
                    <div className="hotel_info">
                        {isLoading || hotel.hotelLogo ? (
                            <div className="hotel_logo">
                                {isLoading ? (
                                    <Skeleton height={150} width={200} />
                                ) : (
                                    <img src={hotel.hotelLogo} alt="Hotel Logo" />
                                )}
                            </div>
                        ) : null}
                        <div className="hotel_location">
                            {isLoading ? (
                                <Skeleton width={100} />
                            ) : (
                                <>
                                    <FaMapMarkerAlt />
                                    {hotel.city} {hotel.country}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="details">
                        <h2 className="hotel_name">
                            {isLoading ? <Skeleton width={200} /> : hotel.name}
                        </h2>
                        <h3 className="hotel_distance">
                            {isLoading ? (
                                <Skeleton width={150} />
                            ) : (
                                `${hotel.distance} Km from the center location`
                            )}
                        </h3>
                        <h3 className="hotel_price">
                            {isLoading ? (
                                <Skeleton width={300} />
                            ) : (
                                <>
                                    Cheapest Price :
                                    <span className="price"> {hotel.cheapestprice} Rs</span>
                                </>
                            )}
                        </h3>
                    </div>
                    {
                        isLoading ? (
                            <Skeleton height={40} width={300} />
                        ) : (
                            <div className="hotel_edit">
                                <button className="edit_button" onClick={handleHotelEdit}>Edit</button>
                            </div>
                        )
                    }

                </div>

                {!isLoading && hotel.photos && (
                    <div className="hotel_gallery">
                        {hotel.photos.map((photo, index) => (
                            <div
                                key={index}
                                className="gallery_image"
                                onClick={() => openImageGallery(index)}
                            >
                                <img src={photo} alt={`Image ${index}`} />
                            </div>
                        ))}
                    </div>
                )}

                <div className="hotel_detail_section">
                    <div className="hotel_detail">
                        {isLoading ? (
                            <>
                                <Skeleton height={40} width={300} />
                                <Skeleton count={3} />
                            </>
                        ) : (
                            <>
                                <h3 className="hotel_title">{hotel.title}</h3>
                                <p className="hotel_description">{hotel.description}</p>
                            </>
                        )}
                    </div>
                    <div className="hotel_rooms-available">
                        {isLoading ? (
                            <>
                                <Skeleton height={40} width={300} />
                                <Skeleton count={3} />
                            </>
                        ) : (
                            <>

                            </>
                        )}


                    </div>

                    {!isLoading && (
                        <div className="hotel_details_price">
                            <div className="price_section">
                                <h3 className="full_price">Rs {hotel.cheapestprice}</h3>
                                <h2 className="stay_details">1 night</h2>
                            </div>

                        </div>
                    )}
                </div>

                {openGallery && (
                    <div className="image_gallery">
                        <div className="close_button" onClick={closeImageGallery}>
                            X
                        </div>
                        <div className="gallery_image_container">
                            <img
                                src={hotel?.photos[currentImage]}
                                alt={`Image ${currentImage}`}
                                className="gallery_image_full"
                            />
                            {currentImage > 0 && (
                                <div
                                    className="previous_image"
                                    onClick={() => setCurrentImage(currentImage - 1)}
                                >
                                    &lt;
                                </div>
                            )}
                            {currentImage < hotel?.photos.length - 1 && (
                                <div
                                    className="next_image"
                                    onClick={() => setCurrentImage(currentImage + 1)}
                                >
                                    &gt;
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelProfile;
