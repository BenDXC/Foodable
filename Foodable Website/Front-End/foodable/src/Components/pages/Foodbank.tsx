import React, { useState, useCallback, useRef, ChangeEvent } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
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
import { ENV, MAP_CONFIG } from "../../constants";
import logger from "../../utils/logger";

const libraries = ["places"] as const;

interface MarkerData {
  lat: number;
  lng: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

const mapContainerStyle = {
  height: "80vh",
  width: "100vw",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  componentRestrictions: { country: "uk" },
};

export default function FoodbankPage(): JSX.Element {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV.GOOGLE_MAPS_API_KEY,
    libraries: libraries as any,
  });
  
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [selected, setSelected] = useState<MarkerData | null>(null);
  
  const onMapClick = useCallback((e: google.maps.MapMouseEvent): void => {
    if (e.latLng) {
      setMarkers((current) => [
        ...current,
        {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        },
      ]);
    }
  }, []);

  const mapRef = useRef<google.maps.Map | null>(null);
  
  const onMapLoad = useCallback((map: google.maps.Map): void => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }: LatLng): void => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(MAP_CONFIG.DETAIL_ZOOM);
    }
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div className="Foodbank-container">
      <h1 className="sr-only">Foodbank Locations</h1>
      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        center={MAP_CONFIG.DEFAULT_CENTER}
        options={options}
        onClick={onMapClick}
        onLoad={onMapLoad}
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

interface LocateProps {
  panTo: (location: LatLng) => void;
}

function Locate({ panTo }: LocateProps): JSX.Element {
  const handleLocate = (): void => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        logger.error('Geolocation failed', error);
      }
    );
  };

  return (
    <button 
      className="locate" 
      onClick={handleLocate}
      aria-label="Get my current location and show nearby foodbanks"
    >
      <img src="../Img/compass1.svg" alt="" aria-hidden="true" />
    </button>
  );
}

interface SearchProps {
  panTo: (location: LatLng) => void;
}

function Search({ panTo }: SearchProps): JSX.Element {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { 
        lat: () => MAP_CONFIG.DEFAULT_CENTER.lat, 
        lng: () => MAP_CONFIG.DEFAULT_CENTER.lng 
      },
      radius: MAP_CONFIG.SEARCH_RADIUS,
    },
  });

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const handleSelect = async (address: string): Promise<void> => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      logger.error('Geocoding failed', error);
    }
  };

  return (
    <div className="search">
      <Combobox onSelect={handleSelect} aria-label="Search for location">
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
          aria-label="Enter location to search for nearby foodbanks"
          aria-describedby="search-instructions"
        />
        <span id="search-instructions" className="sr-only">
          Type a location to search for nearby foodbanks. Use arrow keys to navigate suggestions.
        </span>
        <ComboboxPopover>
          <ComboboxList aria-label="Location suggestions">
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
