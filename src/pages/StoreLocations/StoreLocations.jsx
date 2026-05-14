import { useState } from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import { FiMapPin, FiPhone, FiClock, FiSearch } from "react-icons/fi";
import { MdStorefront } from "react-icons/md";

const STORES = [
  {
    id: 1,
    name: "ZyroMart – Mirpur",
    address: "Mirpur, Dhaka",
    phone: "020-3300335, 017-00000000",
    hours: "10:00 AM – 9:00 PM",
    closed: "Thursday",
    position: { lat: 23.8751, lng: 90.3796 },
  },
  {
    id: 2,
    name: "ZyroMart – Dhanmondi",
    address: "27 Square, Dhanmondi, Dhaka",
    phone: "020-3300335, 017-00000000",
    hours: "10:00 AM – 9:00 PM",
    closed: "Tuesday",
    position: { lat: 23.7925, lng: 90.4046 },
  },
  {
    id: 3,
    name: "ZyroMart – Gulshan",
    address: "Gulshan, Dhaka",
    phone: "020-3300335, 017-00000000",
    hours: "11:00 AM – 9:00 PM",
    closed: "Sunday",
    position: { lat: 23.7465, lng: 90.3761 },
  },
];

const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 };

// ── Skeleton shown while the map SDK loads ────────────────────────────────────
const MapSkeleton = () => (
  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gray-100 animate-pulse">
    <FiMapPin className="text-4xl text-gray-300" />
    <p className="text-sm text-gray-400 font-medium">Loading map…</p>
  </div>
);

// ── Single store card in the sidebar ─────────────────────────────────────────
const StoreCard = ({ store, active, onClick }) => (
  <li
    onClick={onClick}
    className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 group ${
      active
        ? "border-orange-400 bg-orange-50 shadow-md shadow-orange-100"
        : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
    }`}
  >
    {/* Header row */}
    <div className="flex items-start justify-between gap-2 mb-3">
      <h3
        className={`text-sm font-bold leading-snug ${
          active ? "text-orange-600" : "text-gray-800 group-hover:text-orange-600"
        } transition-colors`}
      >
        {store.name}
      </h3>
      {active && (
        <span className="shrink-0 text-[10px] bg-orange-600 text-white px-2 py-0.5 rounded-full font-semibold tracking-wide">
          Viewing
        </span>
      )}
    </div>

    {/* Info rows */}
    <ul className="space-y-2">
      <li className="flex items-start gap-2">
        <FiMapPin className="shrink-0 mt-0.5 text-orange-400 text-sm" />
        <span className="text-xs text-gray-500 leading-relaxed">{store.address}</span>
      </li>
      <li className="flex items-start gap-2">
        <FiPhone className="shrink-0 mt-0.5 text-orange-400 text-sm" />
        <span className="text-xs text-gray-500">{store.phone}</span>
      </li>
      <li className="flex items-start gap-2">
        <FiClock className="shrink-0 mt-0.5 text-orange-400 text-sm" />
        <div className="text-xs text-gray-500 leading-relaxed">
          <span>{store.hours}</span>
          <span className="block text-gray-400">{store.closed} closed</span>
        </div>
      </li>
    </ul>
  </li>
);

// ── InfoWindow content (rendered inside the Google Maps popup) ────────────────
const PopupContent = ({ store }) => (
  <div style={{ minWidth: 200, maxWidth: 260 }} className="text-sm">
    <p className="font-bold text-orange-600 text-base mb-2 leading-tight">{store.name}</p>
    <ul className="space-y-1.5 text-gray-600">
      <li className="flex items-start gap-1.5">
        <FiMapPin className="shrink-0 mt-0.5 text-orange-400" />
        <span className="text-xs">{store.address}</span>
      </li>
      <li className="flex items-start gap-1.5">
        <FiPhone className="shrink-0 mt-0.5 text-orange-400" />
        <span className="text-xs">{store.phone}</span>
      </li>
      <li className="flex items-start gap-1.5">
        <FiClock className="shrink-0 mt-0.5 text-orange-400" />
        <div className="text-xs">
          <span>{store.hours}</span>
          <span className="block text-gray-400">{store.closed} closed</span>
        </div>
      </li>
    </ul>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const StoreLocations = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.GOOGLE_MAPS_API_KEY,
  });

  const filtered = STORES.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCardClick = (store) => {
    setSelected((prev) => (prev?.id === store.id ? null : store));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">

      {/* ── Hero ── */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white py-10 px-4 mb-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <MdStorefront className="text-4xl opacity-90" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Our Store Locations</h1>
          </div>
          <p className="text-orange-100 text-sm md:text-base max-w-lg">
            Find a ZyroMart near you. Visit any of our {STORES.length} stores across Dhaka for the best tech shopping experience.
          </p>
        </div>
      </div>

      {/* ── Layout ── */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

        {/* ── Sidebar ── */}
        <div className="flex flex-col gap-4">

          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search stores or areas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white shadow-sm text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
          </div>

          {/* Count */}
          <p className="text-[11px] text-gray-400 uppercase tracking-widest font-semibold px-0.5">
            {filtered.length} of {STORES.length} stores
          </p>

          {/* Cards */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-gray-400">
              <FiMapPin className="text-3xl" />
              <p className="text-sm font-medium">No stores match your search</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {filtered.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  active={selected?.id === store.id}
                  onClick={() => handleCardClick(store)}
                />
              ))}
            </ul>
          )}
        </div>

        {/* ── Map ── */}
        <div className="col-span-2 rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-white"
          style={{ height: 540 }}>
          {!isLoaded ? (
            <MapSkeleton />
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              zoom={selected ? 14 : 12}
              center={selected?.position ?? DEFAULT_CENTER}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: true,
                zoomControlOptions: { position: 9 },
              }}
            >
              {STORES.map((store) => (
                <Marker
                  key={store.id}
                  position={store.position}
                  onClick={() => handleCardClick(store)}
                />
              ))}

              {selected && (
                <InfoWindow
                  position={selected.position}
                  onCloseClick={() => setSelected(null)}
                >
                  <PopupContent store={selected} />
                </InfoWindow>
              )}
            </GoogleMap>
          )}
        </div>

      </div>
    </div>
  );
};

export default StoreLocations;
