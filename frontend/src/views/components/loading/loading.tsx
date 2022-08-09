import React from "react";

export const Loading:React.FC<{width?: string, height?: string}> = ({width, height}) => {
    return (
        <div id="loading" style={{width: width, height: height}}>
            <div className="loader">
                <div></div>
                <div></div>
            </div>
        </div>);
}