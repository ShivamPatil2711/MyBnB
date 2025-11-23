import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext';

const HostAddHome = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 20.0, lng: 77.0 });
  const [formData, setFormData] = useState({
    housename: '',
    location: '',
    price: '',
    rate: '',
    img: null,
    des: '',
    latitude: 20.0,
    longitude: 77.0,
  });
  const [loading, setLoading] = useState(false);
  const imgUrlRef = useRef(null); // Track object URL for image preview cleanup

  // Initialize Google Map
  useEffect(() => {
    const initMap = () => {
      if (window.google && mapRef.current) {
        const initial = { lat: 20.0, lng: 77.0 };
        
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: initial,
          zoom: 10,
        });

        const newMarker = new window.google.maps.Marker({
          position: initial,
          map: newMap,
          draggable: true,
          title: 'Drag me or click on the map!',
        });

        // Initialize Autocomplete
        if (searchRef.current) {
          const newAutocomplete = new window.google.maps.places.Autocomplete(searchRef.current);
          newAutocomplete.bindTo('bounds', newMap);
          
          newAutocomplete.addListener('place_changed', () => {
            const place = newAutocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
              return;
            }

            // Update map center and marker position
            newMap.setCenter(place.geometry.location);
            newMap.setZoom(15);
            newMarker.setPosition(place.geometry.location);
            
            const newCoords = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setCoordinates(newCoords);
            setFormData((prev) => ({
              ...prev,
              latitude: newCoords.lat,
              longitude: newCoords.lng,
            }));
          });
          
          setAutocomplete(newAutocomplete);
        }

        // Click to move marker
        newMap.addListener('click', (e) => {
          newMarker.setPosition(e.latLng);
          const newCoords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
          setCoordinates(newCoords);
          setFormData((prev) => ({
            ...prev,
            latitude: newCoords.lat,
            longitude: newCoords.lng,
          }));
        });

        // Drag to move marker
        newMarker.addListener('dragend', () => {
          const p = newMarker.getPosition();
          const newCoords = { lat: p.lat(), lng: p.lng() };
          setCoordinates(newCoords);
          setFormData((prev) => ({
            ...prev,
            latitude: newCoords.lat,
            longitude: newCoords.lng,
          }));
        });

        setMap(newMap);
        setMarker(newMarker);
      }
    };

    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src =import.meta.env.REACT_APP_API_URL; //*********/////
      script.async = true;
      script.defer = true;
      window.initGoogleMap = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  // Cleanup object URL for image preview on unmount or new file selection
  useEffect(() => {
    return () => {
      if (imgUrlRef.current) {
        URL.revokeObjectURL(imgUrlRef.current);
        imgUrlRef.current = null;
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        e.target.value = ''; // Clear input
        return;
      }
      // Validate file size (5MB limit to match backend)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        e.target.value = ''; // Clear input
        return;
      }
      // Revoke previous object URL if exists
      if (imgUrlRef.current) {
        URL.revokeObjectURL(imgUrlRef.current);
      }
      // Create new object URL for preview
      imgUrlRef.current = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, img: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error('Please log in to submit');
      navigate('/login-page');
      return;
    }
    if (!formData.housename || !formData.location || !formData.price || 
        !formData.rate || !formData.des || !formData.img) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('housename', formData.housename);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('rate', formData.rate);
      formDataToSend.append('des', formData.des);
      formDataToSend.append('img', formData.img);
      formDataToSend.append('latitude', formData.latitude);
      formDataToSend.append('longitude', formData.longitude);

      const response = await fetch('http://localhost:4002/api/host/airbnb-home', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend,
      });

      const data = await response.json();
          toast.success('Home added successfully');
      navigate('/host/host-homes');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-700 text-xl font-medium">Submitting...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center border border-red-100">
        <h1 className="text-2xl font-bold text-red-700 mb-6">Register Your Home</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label for="housename" className="block font-semibold text-red-700 mb-1">
              Housename:
            </label>
            <input
              type="text"
              id="housename"
              name="housename"
              placeholder="Enter your housename"
              value={formData.housename}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          
          <div>
            <label for="location" className="block font-semibold text-red-700 mb-1">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>

          {/* Map Section */}
          <div>
            <label className="block font-semibold text-red-700 mb-1">
              Pin Your Exact Location:
            </label>
            
            {/* Search Input */}
            <input
              ref={searchRef}
              type="text"
              placeholder="Search for a place..."
              className="w-full px-4 py-2 mb-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            
            <div 
              ref={mapRef} 
              style={{ width: '100%', height: '400px', border: '1px solid #ccc', borderRadius: '8px' }}
            ></div>
            <div className="mt-2 text-sm text-gray-600">
              Latitude: <span className="font-mono">{coordinates.lat.toFixed(5)}</span>, 
              Longitude: <span className="font-mono">{coordinates.lng.toFixed(5)}</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="price" className="block font-semibold text-red-700 mb-1">
              Price:
            </label>
            <input
                type="text"
              inputMode="decimal"
              pattern="[0-9]*"     // Only allows digits
              id="price"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          
          <div>
            <label htmlFor="rate" className="block font-semibold text-red-700 mb-1">
              Rating:
            </label>
            <input
              type="number"
              id="rate"
              name="rate"
              placeholder="Enter rating"
              value={formData.rate}
              onChange={handleChange}
              min="0"
              max="5"
              step="0.1"
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
          </div>
          
          <div>
            <label htmlFor="des" className="block font-semibold text-red-700 mb-1">
              Description:
            </label>
            <textarea
              id="des"
              name="des"
              placeholder="Enter description"
              value={formData.des}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition min-h-[80px] resize-y"
            />
          </div>
          
          <div>
            <label htmlFor="img" className="block font-semibold text-red-700 mb-1">
              Image:
            </label>
            <input
              type="file"
              id="img"
              name="img"
              onChange={handleFileChange}
              required
              accept="image/*"
              className="w-full px-4 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 transition"
            />
            {formData.img && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected: {formData.img.name}</p>
                <img
                  src={imgUrlRef.current}
                  alt="Preview"
                  className="mt-2 max-h-40 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-red-500 text-white rounded-lg font-semibold transition mt-2 hover:bg-red-600"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostAddHome;