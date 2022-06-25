import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export  const SettingsOption:React.FC<{icon: IconDefinition, title: string, subOptions?: Array<any>, onClick?: Function}> = ({icon, title, subOptions, onClick}) => {
    const [showSubOptions, setShowSubOptions] = useState(false);
    return (
        <div 
            className="settingsOption">
            <button
                title={title}
                onClick={() =>
                {
                    if (!subOptions && onClick)
                        onClick();
                    else if (subOptions)
                        setShowSubOptions(!showSubOptions);
                }}>
                <FontAwesomeIcon icon={showSubOptions ? faClose : icon}/>
            </button>
            {showSubOptions && subOptions && <ul className="subOptions">
                {subOptions.map((option, k) => <li className="subOptionItem" key={k}>{option}</li>)}
            </ul>}
        </div>
    );
}
