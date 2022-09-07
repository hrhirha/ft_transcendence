import React from "react";

export const Numeral:React.FC<{value: number}> = ({value}) => {
    let newValue: string = value.toString();
    if (value >= 1000) {
        let suffixes: Array<string> = ["", "K", "M", "B","T"];
        let suffixNum: number = Math.floor( (""+value).length/3 );
        let shortValue: number = 0;
        let shortValueStr: string = '';
        for (let precision : number = 2; precision >= 1; precision--) {
            shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0)  shortValueStr = shortValue.toFixed(1);
            newValue = shortValue+suffixes[suffixNum];
    }
    return (<>{newValue}</>);
}