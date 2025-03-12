import React, { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";

const locations = [
  {
    id: 1,
    name: "ZyroMart - Mirpur",
    address: "Mirpur, Dhaka",
    phone: "0203300335, 01700000000",
    openingHours: "10:00 AM - 9:00 PM (Thursday Closed)",
    position: { lat: 23.8751, lng: 90.3796 },
  },
  {
    id: 2,
    name: "ZyroMart - Dhanmondi",
    address: "27 Square, Dhanmondi, Dhaka",
    phone: "0203300335, 01700000000",
    openingHours: "10:00 AM - 9:00 PM (Tuesday Closed)",
    position: { lat: 23.7925, lng: 90.4046 },
  },
  {
    id: 3,
    name: "ZyroMart - Gulshan",
    address: "Gulshan, Dhaka",
    phone: "0203300335, 01700000000",
    openingHours: "11:00 AM - 9:00 PM (Sunday Closed)",
    position: { lat: 23.7465, lng: 90.3761 },
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const center = { lat: 23.8103, lng: 90.4125 }; 

const StoreLocations = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [search, setSearch] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Sidebar */}
      <div className="bg-white p-4 border rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Store Locations</h2>
        <input
          type="text"
          placeholder="Search"
          className="w-full border p-2 rounded mb-4 bg-white focus:outline-none focus:ring-1 focus:ring-primary"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="space-y-4">
          {filteredLocations.map((location) => (
            <li
              key={location.id}
              className="p-4 border rounded-lg shadow hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedLocation(location)}
            >
              <h3 className="text-lg font-semibold text-primary">{location.name}</h3>
              <p className="text-gray-600">{location.address}</p>
              <p className="text-gray-600">{location.phone}</p>
              <p className="text-gray-600">{location.openingHours}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Map */}
      <div className="col-span-2">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={center}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={location.position}
              onClick={() => setSelectedLocation(location)}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.position}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div>
                <h3 className="font-bold text-lg">{selectedLocation.name}</h3>
                <p>{selectedLocation.address}</p>
                <p>{selectedLocation.phone}</p>
                <p>{selectedLocation.openingHours}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </div>
    </div>
  );
};

export default StoreLocations;
