import React from "react";
import "./Spinner.scss"
const Spinner = () => {
    return (
        <div className="spinner">
            <span role="img" aria-label="Loading">
                ⏳
            </span>
        </div>
    );
};

export default Spinner;
