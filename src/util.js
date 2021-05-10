import React from 'react';
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";

const casesTypeColors = {
    cases: {
      option: { color:"#cc1034", fillColor: "#cc1034" },
      multiplier: 300,
    },
    recovered: {
      option: { color:"#7dd71d", fillColor: "#7dd71d" },
      multiplier: 600,
    },
    deaths: {
      option: { color:"#ff6c47", fillColor: "#ff6c47" },
      multiplier: 900,
    },
  };

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a,b) => {
        if (a.cases > b.cases) {
            return -1;
        } else {
            return 1;
        }
    })
    return sortedData;
}

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";


// Draw the holes on the map
export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      pathOptions={casesTypeColors[casesType].option}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
        <Popup>
            <div className= "info-container">
                <div className="info-flag"
                style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                ></div>
                <div className="info-name">{country.country}</div>
                <div className="info-cases">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
            </div>
        </Popup>
    </Circle>
));
