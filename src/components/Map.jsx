import React, { useRef, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaDirections, FaRegClock, FaPhone } from 'react-icons/fa';

// --- Configuration ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const storeInfo = {
  name: "Boruya Sushi",
  branch: "MBK Center",
  address: "MBK Center ชั้น 7 Zone A ห้อง 17.1 (ใกล้โรงหนัง)",
  fullAddress: "ชั้น 7, 444 ถ. พญาไท, แขวงวังใหม่, เขตปทุมวัน, กรุงเทพมหานคร 10330",
  coordinates: [13.7448, 100.5293],
  workingHours: "11:00 - 00:00 น.",
  googleMapsUrl: "https://www.google.com/maps/dir/?api=1&destination=13.7448,100.5293"
};

const tileLayerUrl = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const tileLayerAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: storeInfo.coordinates,
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      L.tileLayer(tileLayerUrl, {
        attribution: tileLayerAttr,
        maxZoom: 20
      }).addTo(map);

      // Clean default marker
      L.marker(storeInfo.coordinates)
        .addTo(map)
        .bindPopup(`<div style="font-family: sans-serif; font-size: 14px; text-align: center;"><b>${storeInfo.name}</b><br>${storeInfo.branch}</div>`)
        .openPopup();

      setTimeout(() => map.invalidateSize(), 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left Column: Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center space-y-10"
          >
            <div>
              <span className="inline-block py-1 px-3 border border-gray-300 rounded-full text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                Location
              </span>
              <h2 className="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
                {storeInfo.name} <br />
                <span className="font-semibold">{storeInfo.branch}</span>
              </h2>
            </div>

            <div className="space-y-8">
              {/* Address Item */}
              <div className="flex items-start">
                <div className="mt-1 mr-6 text-gray-400">
                  <FaMapMarkerAlt size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-2">ที่อยู่</h3>
                  <p className="text-gray-600 leading-relaxed font-light text-lg">
                    {storeInfo.address}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {storeInfo.fullAddress}
                  </p>
                </div>
              </div>

              {/* Time Item */}
              <div className="flex items-start">
                <div className="mt-1 mr-6 text-gray-400">
                  <FaRegClock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900 mb-2">เวลาทำการ</h3>
                  <p className="text-gray-600 font-light text-lg">
                    เปิดบริการทุกวัน
                  </p>
                  <p className="text-gray-900 font-medium text-xl mt-1">
                    {storeInfo.workingHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <motion.a
                href={storeInfo.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center space-x-3 bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-black transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                <FaDirections className="text-gray-300" />
                <span className="font-medium tracking-wide">Get Directions</span>
              </motion.a>
            </div>
          </motion.div>

          {/* Right Column: Map */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full h-[400px] lg:h-[600px] bg-gray-100 rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative"
          >
            <div
              ref={mapContainerRef}
              className="w-full h-full grayscale-[20%] hover:grayscale-0 transition-all duration-700 ease-in-out"
            // Added subtle grayscale that fades on hover for extra "minimalist" feel
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MapComponent;