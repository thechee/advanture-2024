import { VanForm } from "../VanForm"
import { useVanFormContext } from "../VanFormContext"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LeftArrow } from "../../../Icons/LeftArrow";
import { RightArrow } from "../../../Icons/RightArrow";

export const CreateVan = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.session.user);

  const {
    page,
    setPage,
    data,
    title,
    handleChange,
    yearsOptions, 
    makes, 
    doorsOptions, 
    seatsOptions, 
    zipCodeRegex, 
    automotiveYear,
    maxFileError,
    loading,
    setLoading,
    validationErrors,
    setValidationErrors,

  } = useVanFormContext();

  if (!user) {
    return <h1>You must be logged in to add a van!</h1>;
  }

  const handlePrev = () => {
    setPage(page => page - 1);
  }
  
  const handleNext = () => {
    setPage(page => page + 1);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationErrors({});
    const errors = {};
    if (!year || year == "placeholder") errors.year = "Van year is required";
    if (year > automotiveYear)
      errors.year = "Year can not be after the current automotive year";
    if (year && year < 1950)
      errors.year = "We do not accept vans this old on Advanture";
    if (make == "placeholder") errors.make = "Van make is required";
    if (!makes.includes(make) && make !== "placeholder")
      errors.make = "YOU ARE UP TO NO GOOD!";
    if (!model) errors.model = "Van model is required";
    if (model.length > 30)
      errors.model = "Van model must be shorter than 30 characters";
    if (!miles) errors.miles = "Milage is required";
    if (miles < 1) errors.miles = "Milage must be a positive number";
    if (miles > 500000) errors.miles = "YOU ARE LYING";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (city.length < 3)
      errors.city = "City name must be at least 3 characters";
    if (city.length > 30)
      errors.city = "City name must less than 30 characters";
    if (state == "placeholder") errors.state = "State is required";
    if (!zipCode) errors.zipCode = "Zip code is required";
    if (!zipCodeRegex.test(zipCode))
      errors.zipCode = "Must be a valid zip code";
    if (!rentalRate) errors.rentalRate = "Daily rental rate is required";
    if (rentalRate < 1)
      errors.rentalRate = "Daily rental rate must be a positive number";
    if (rentalRate > 500)
      errors.rentalRate = "We do not accept rental rates greater than $500/day";
    if (!Number.isInteger(parseInt(rentalRate)))
      errors.rentalRate = "Must be a whole dollar amount";
    if (!description) errors.description = "Description is required";
    if (description.length < 50)
      errors.description = "Description must be at least 50 characters";
    if (description.length > 9999)
      errors.description = "Description must not be a book";
    if (!distanceIncluded && unlimited == false)
      errors.distanceIncluded = "Distance included is required";
    if (distanceIncluded <= 0 && unlimited == false)
      errors.distanceIncluded = "Must be a positive number";
    if (!mpg && fuelTypeId != 4)
      errors.mpg = "MPG is required for non-electric vehicles";
    if (mpg < 1 && fuelTypeId != 4)
      errors.mpg = "MPG is must be a positive number";
    if (mpg > 150 && fuelTypeId != 4) errors.mpg = "MPG can not be over 150";
    if (!doors || doors == "placeholder") errors.doors = "Doors is required";
    if (doors < 1) errors.doors = "Van must have at least 1 door";
    if (doors > 9) errors.doors = "Your van has too many doors";
    if (!seats || seats == "placeholder") errors.seats = "Seats is required";
    if (seats < 1) errors.seats = "Van must have at least 1 seat";
    if (seats > 12) errors.seats = "This is a website for vans, not buses";
    if (fuelTypeId == "placeholder")
      errors.fuelTypeId = "Fuel type is required";
    if (fuelTypeId > 5 || fuelTypeId < 1)
      errors.fuelTypeId = "YOU ARE UP TO NO GOOD!";
    if (!image) errors.image = "Image is required";
    if (
      !image?.name.endsWith(".jpeg") &&
      !image?.name.endsWith(".jpg") &&
      !image?.name.endsWith(".png")
    ) {
      validationErrors.image = "Image must be in .jpeg, .jpg, or .png format";
    }

    if (Object.values(errors).length) {
      setValidationErrors(errors);
    } else {
      setLoading(true);

      let lat;
      let lng;

      const { Geocoder } = await google.maps.importLibrary("geocoding");

      const geocoder = new Geocoder();

      await geocoder.geocode(
        {
          address: `${address}, ${city}, ${state}`,
        },
        (results, status) => {
          if (status == "OK") {
            lat = results[0].geometry.location.lat()
            lng = results[0].geometry.location.lng()
          }
        }
      )

      await dispatch(
        thunkAddVan({
          year,
          make,
          model,
          miles,
          address,
          city,
          state,
          zip_code: zipCode,
          rental_rate: rentalRate,
          description,
          distance_allowed: distanceIncluded,
          mpg,
          doors,
          seats,
          fuel_type_id: fuelTypeId,
          lat,
          lng,
        }))
        .then(async (data) => {
          if (!data.id) {
            if (data.fuel_type_id) data.fuelTypeId = data.fuel_type_id;
            if (data.rental_rate) data.rentalRate = data.rental_rate;
            if (data.zip_code) data.zipCode = data.zip_code;

            setValidationErrors(data);
            setLoading(false);
          } else {
            const formData = new FormData();

            formData.append("van_id", data.id);
            formData.append("image", image);
            formData.append("preview", true);

            await dispatch(thunkAddVanImage(formData, data.id)).then(() =>
              navigate(`/vans/${data.id}`)
            );
          }
        });
    }
  };

  const fileWrap = (e) => {
    e.stopPropagation();

    const tempFile = e.target.files[0];

    // Check for max image size of 5Mb
    if (tempFile.size > 5000000) {
      setFileName(maxFileError);
      return;
    }

    const newImageURL = URL.createObjectURL(tempFile); // Generate a local URL to render the image file inside of the <img> tag.
    setImageURL(newImageURL);
    setImage(tempFile);
    setFileName(tempFile.name);
    // setOptional("");
  };


  return (
    <form className="create-van-form" onSubmit={handleSubmit}>
      <header>
        <h2>{title[page]}</h2>
      </header>
      
      <VanForm />

      <div className="van-form-btns-div">
        <button type="button" onClick={handlePrev}><LeftArrow />Prev</button>
        <button type="button" onClick={handleNext}><RightArrow />Next</button>
        <button className="submit-btn" type="submit" disabled={loading}>{loading ? "Loading..." : "Add van"}</button>
      </div>
    </form>
  )
}