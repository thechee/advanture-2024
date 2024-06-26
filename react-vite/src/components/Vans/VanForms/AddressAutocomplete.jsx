import { useRef, useEffect, useState } from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import { useVanFormContext } from '../../../hooks/useVanFormContext';

// This is an example of the classic "Place Autocomplete" widget.
// https://developers.google.com/maps/documentation/javascript/place-autocomplete
export const PlaceAutocompleteClassic = ({ onPlaceSelect, address }) => {
  const [placeAutocomplete, setPlaceAutocomplete] = useState(null);
  const inputRef = useRef(null);
  const places = useMapsLibrary('places');
  const { setValidAddressSelected } = useVanFormContext();

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['geometry', 'formatted_address']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <label>Where is your van located?</label>
      <input 
        id='van-form-autocomplete' 
        ref={inputRef} 
        defaultValue={address}
        onChange={() => {setValidAddressSelected(false)}}
        />
    </div>
  );
};