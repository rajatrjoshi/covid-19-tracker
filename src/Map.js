import React, {useState} from "react";
import { MapContainer as LeafletMap, TileLayer } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./util";

function Map({ countries, casesType, center, zoom }) {
  const [map, setmap] = useState(null);
  if(map)
    {
      map.flyTo(center);
    }

  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom} whenCreated={setmap}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {(countries)?showDataOnMap(countries,casesType):null}
      </LeafletMap>
    </div>
  );
}
export default Map;
