import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
  InfoBox,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import "./cssFiles/Foodbank.css";
import "@reach/combobox/styles.css";

const libraries = ["places"];

const mapContainerStyle = {
  height: "80vh",
  width: "100vw",
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
  componentRestrictions: { country: "uk" },
};
const center = {
  lat: 51.53474,
  lng: -0.4686402,
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const onMapClick = React.useCallback((e) => {
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      },
    ]);
  }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div className="Foodbank-container">
      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={11}
        center={center}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
        strictBounds={true}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
            icon={{
              url: `../Img/foodable.svg`,
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}
        <Marker
          position={{ lat: 51.53221, lng: -0.48481 }}
          icon={{
            url: `../Img/1.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        <img src="../Img/foodablemain.jpg" alt="Foodable" width="150vw" />
        {/* <InfoWindow
            position={{ lat: 51.532210, lng: -0.484810  }}
            onClick={() => {
              setSelected(Marker);
            }}
          >
           
            <div>
              <h4>
              Foodbank @ The Living Room
             
              
              </h4>
              <h5> Address: The Living Room, High St, Cowley, Uxbridge UB8 2DZ</h5>
              <h1>
    
    
    
  </h1>
              
 
            </div>
          </InfoWindow> */}
        <Marker
          position={{ lat: 51.55192, lng: -0.48669 }}
          icon={{
            url: `../Img/2.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        {/* 
        <InfoWindow
          position={{ lat: 51.551920, lng: -0.486690 }}
          onClick={() => {
            setSelected(Marker);
          }}
        >
          <div>
            <h4>
              Hillingdon FoodBank

            </h4>
            <h5> Address: 30 Oxford Rd, Denham, Uxbridge UB9 4DQ</h5>




          </div>
        </InfoWindow> */}
        )) ))
        <Marker
          position={{ lat: 51.53243, lng: -0.45178 }}
          icon={{
            url: `../Img/3.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        {/* <InfoWindow
          position={{ lat: 51.532430, lng: -0.451780 }}
          onClick={() => {
            setSelected(Marker);
          }}
        >
          <div>
            <h4>
              The Salvation Army (Hillingdon)

            </h4>
            <h5> Address: The Royal British Legion, 125 Uxbridge Rd, Uxbridge UB10 0LQ</h5>




          </div>
        </InfoWindow> */}
        ))
        <Marker
          position={{ lat: 51.544877, lng: -0.483096 }}
          icon={{
            url: `../Img/4.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        {/* <InfoWindow
          position={{ lat: 51.544877, lng: -0.483096 }}
          onClick={() => {
            setSelected(Marker);
          }}
        >
          <div>
            <h4>
              Hillingdon FoodBank

            </h4>
            <h5>Address:  4 New Windsor St, Uxbridge UB8 2TU</h5>




          </div>
        </InfoWindow> */}
        ))
        <Marker
          position={{ lat: 51.603473, lng: -0.482039 }}
          icon={{
            url: `../Img/5.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        {/* <InfoWindow
          position={{ lat: 51.603473, lng: -0.482039 }}
          onClick={() => {
            setSelected(Marker);
          }}
        >
          <div>
            <h4>
              Hillingdon Crisis Support

            </h4>
            <h5>Address:R/o church hall, High St, Harefield UB9 6BX</h5>




          </div>
        </InfoWindow> */}
        ))
        <Marker
          position={{ lat: 51.639995, lng: -0.490113 }}
          icon={{
            url: `../Img/6.png`,
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(15, 15),
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        {/* <InfoWindow
          position={{ lat: 51.639995, lng: -0.490113 }}
          onClick={() => {
            setSelected(Marker);
          }}
        >
          <div>
            <h4>
              Rickmansworth Foodbank

            </h4>
            <h5>Address: The Mill, Methodist Church, Berry Lane, Mill End, Rickmansworth WD3 7HJ</h5>




          </div>
        </InfoWindow> */}
      </GoogleMap>

      <div className="Info-box-6">
        <h5 className="foodbank-h5"> 1 - Foodbank @ The Living Room</h5>
        <h6 className="h6">
          {" "}
          Address: The Living Room, High St, Cowley, Uxbridge UB8 2DZ Phone
          number: 01895 233466
        </h6>

        <h5 className="foodbank-h5"> 2 - Hillingdon FoodBank</h5>
        <h6 className="h6">
          Address: 30 Oxford Rd, Denham, Uxbridge UB9 4DQ Phone Number : 01895
          252224
        </h6>

        <h5 className="foodbank-h5"> 3 - The Salvation Army (Hillingdon)</h5>
        <h6 className="h6">
          Address: The Royal British Legion, 125 Uxbridge Rd, Uxbridge UB10 0LQ
          Phone Number : 01895 271395
        </h6>

        <h5 className="foodbank-h5"> 4 - Hillingdon FoodBank</h5>
        <h6>Address: 4 New Windsor St, Uxbridge UB8 2TU Phone Number :N/A</h6>
        <h5 className="foodbank-h5"> 5 - Hillingdon Crisis Support</h5>
        <h6 className="h6">
          Address: R/o church hall, High St, Harefield UB9 6BX Phone Number :
          01895 72514
        </h6>
        <h5 className="foodbank-h5"> 6 - Rickmansworth Foodbank</h5>
        <h6 className="h6">
          Address: The Mill, Methodist Church, Berry Lane, Mill End,
          Rickmansworth WD3 7HJ Phone Number : 07716 856892
        </h6>
      </div>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="../Img/compass1.svg" alt="Get Location" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 51.53474, lng: () => -0.4686402 },
      radius: 10 * 100,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log(" Error: ", error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}
