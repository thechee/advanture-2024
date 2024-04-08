/* global google */
import { FormInputs } from "./FormInputs";
import { useVanFormContext } from "../../../hooks/useVanFormContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { LeftArrow } from "../../Icons/LeftArrow";
import { RightArrow } from "../../Icons/RightArrow";
import { thunkAddVan, thunkAddVanImages, thunkUpdateVan, thunkUpdateVanImages, thunkGetOneVan } from "../../../redux/van";
import "./VanForm.css";
import { useEffect } from "react";
import { FormBar } from "./FormBar";

export const VanForm = ({ type }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vanId } = useParams();
  const user = useSelector((state) => state.session.user);
  const van = useSelector((state) => state.vans[vanId]);

  const {
    page,
    setPage,
    data,
    setData,
    title,
    makesOptions,
    zipCodeRegex,
    automotiveYear,
    loading,
    setLoading,
    setValidationErrors,
    validationErrors,
  } = useVanFormContext();

  useEffect(() => {
    if (type === "update") {
      if (!van) {
        dispatch(thunkGetOneVan(vanId));
      } else {
        setData({
          year: van.year,
          make: van.make,
          model: van.model,
          miles: van.miles,
          doors: van.doors,
          seats: van.seats,
          fuelTypeId: van.fuelTypeId,
          mpg: van.mpg,
          rentalRate: van.rentalRate,
          distanceIncluded: van.distanceAllowed,
          address: van.address,
          city: van.city,
          state: van.state,
          zipCode: van.zipCode,
          description: van.description,
          images: Object.values(van.images),
        });
        setPage(0);
        setValidationErrors({});
      }
    } else {
        setData({
        year: "placeholder",
        make: "placeholder",
        model: "",
        miles: "",
        address: "",
        city: "",
        state: "placeholder",
        zipCode: "",
        rentalRate: "",
        description: "",
        distanceIncluded: "",
        unlimited: false,
        mpg: "",
        doors: "placeholder",
        seats: "placeholder",
        fuelTypeId: "placeholder",
        images: [],
      })
      setPage(0);
      setValidationErrors({});
    }
  }, [type, van, vanId]);


  if (!user) {
    return <h1>You must be logged in to add/update a van</h1>;
  }

  const handlePrev = () => {
    setPage((page) => page - 1);
  };

  const handleNext = () => {
    setValidationErrors({});

    const errors = {};
    // if (page === 0) {
    //   if (!data.year || data.year == "placeholder")
    //     errors.year = "Van year is required";
    //   if (data.year > automotiveYear)
    //     errors.year = "Year can not be after the current automotive year";
    //   if (data.year && data.year < 1950)
    //     errors.year = "We do not accept vans this old on Advanture";
    //   if (data.make == "placeholder") errors.make = "Van make is required";
    //   if (!makesOptions.includes(data.make) && data.make !== "placeholder")
    //     errors.make = "YOU ARE UP TO NO GOOD!";
    //   if (!data.model) errors.model = "Van model is required";
    //   if (data.model.length > 30)
    //     errors.model = "Van model must be shorter than 30 characters";
    //   if (!data.miles) errors.miles = "Milage is required";
    //   if (data.miles < 1) errors.miles = "Milage must be a positive number";
    //   if (data.miles > 500000) errors.miles = "YOU ARE LYING";
    //   if (!data.doors || data.doors == "placeholder")
    //     errors.doors = "Door selection required";
    //   if (data.doors < 1) errors.doors = "Van must have at least 1 door";
    //   if (data.doors > 9) errors.doors = "Your van has too many doors";
    //   if (!data.seats || data.seats == "placeholder")
    //     errors.seats = "Seat selection required";
    //   if (data.seats < 1) errors.seats = "Van must have at least 1 seat";
    //   if (data.seats > 12)
    //     errors.seats = "This is a website for vans, not buses";
    //   if (data.fuelTypeId == "placeholder")
    //     errors.fuelTypeId = "Fuel type is required";
    //   if (data.fuelTypeId > 5 || data.fuelTypeId < 1)
    //     errors.fuelTypeId = "YOU ARE UP TO NO GOOD!";
    //   if (!data.mpg && data.fuelTypeId != 4)
    //     errors.mpg = "MPG is required for non-electric vehicles";
    //   if (data.mpg < 1 && data.fuelTypeId != 4)
    //     errors.mpg = "MPG is must be a positive number";
    //   if (data.mpg > 150 && data.fuelTypeId != 4)
    //     errors.mpg = "MPG can not be over 150";
    //   if (!data.rentalRate) errors.rentalRate = "Daily rental rate is required";
    //   if (data.rentalRate < 1)
    //     errors.rentalRate = "Rental rate must be a positive number";
    //   if (data.rentalRate > 500)
    //     errors.rentalRate =
    //       "Rental rates must be less than $500/day";
    //   if (!Number.isInteger(parseInt(data.rentalRate)))
    //     errors.rentalRate = "Must be a whole dollar amount";
    //   if (!data.distanceIncluded && data.unlimited == false)
    //     errors.distanceIncluded = "Distance included is required";
    //   if (data.distanceIncluded <= 0 && data.unlimited == false)
    //     errors.distanceIncluded = "Must be a positive number";
    // }
    // if (page === 1) {
    //   if (!data.address) errors.address = "Address is required";
    //   if (!data.city) errors.city = "City is required";
    //   if (data.city.length < 3)
    //     errors.city = "City must be at least 3 characters";
    //   if (data.city.length > 30)
    //     errors.city = "City must less than 30 characters";
    //   if (data.state == "placeholder") errors.state = "State is required";
    //   if (!data.zipCode) errors.zipCode = "Zip code is required";
    //   if (!zipCodeRegex.test(data.zipCode))
    //     errors.zipCode = "Must be a valid zip code";
    // }
    // if (page === 2) {
    //   if (!data.description) errors.description = "Description is required";
    //   if (data.description.length < 50)
    //     errors.description = "Description must be at least 50 characters";
    //   if (data.description.length > 9999)
    //     errors.description = "Description must not be a book";
    // }

    if (Object.values(errors).length) {
      setValidationErrors(errors);
    } else {
      setPage((page) => page + 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationErrors({});
    const errors = {};

    if (!data.images) errors.image = "At least one image is required";

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
          address: `${data.address}, ${data.city}, ${data.state}`,
        },
        (results, status) => {
          if (status == "OK") {
            lat = results[0].geometry.location.lat();
            lng = results[0].geometry.location.lng();
          }
        }
      );

      type !== "update" ? 
      await dispatch(
        thunkAddVan({
          year: data.year,
          make: data.make,
          model: data.model,
          miles: data.miles,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          rental_rate: data.rentalRate,
          description: data.description,
          distance_allowed: data.distanceIncluded,
          mpg: data.mpg,
          doors: data.doors,
          seats: data.seats,
          fuel_type_id: data.fuelTypeId,
          lat,
          lng,
        })
      ) :
      await dispatch(
        thunkUpdateVan({
          year: data.year,
          make: data.make,
          model: data.model,
          miles: data.miles,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zipCode,
          rental_rate: data.rentalRate,
          description: data.description,
          distance_allowed: data.distanceIncluded,
          mpg: data.mpg,
          doors: data.doors,
          seats: data.seats,
          fuel_type_id: data.fuelTypeId,
          lat,
          lng,
        }, vanId)
      )
      .then(async (resData) => {
        if (!resData.id) {
          if (resData.fuel_type_id) resData.fuelTypeId = resData.fuel_type_id;
          if (resData.rental_rate) resData.rentalRate = resData.rental_rate;
          if (resData.zip_code) resData.zipCode = resData.zip_code;

          setValidationErrors(resData);
          setLoading(false);
        } else {
          const formData = new FormData();

          formData.append("van_id", resData.id);

          if (type === "update") {
            data.images.forEach((image, index) => {
              if (image.src && image.src.file instanceof File) {
                formData.append("image", image.src.file);
              } else {
                formData.append("imageId", image.id);
              }
              formData.append("preview", index === 0);
            });

            await dispatch(thunkUpdateVanImages(formData, resData.id)).then(() => {
              setLoading(false);
              setData({});
              setPage(0);
              navigate(`/vans/${resData.id}`);
            })
          } else {
            data.images.forEach((image, index) => {
              formData.append("image", image.src.file);
              formData.append("preview", index === 0);
            });
            await dispatch(thunkAddVanImages(formData, resData.id)).then(() => {
              setLoading(false);
              setData({});
              setPage(0);
              navigate(`/vans/${resData.id}`);
            })
          }
        }
      })
    }
  }

  return (
    <form
      className="van-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <header className="form-header">
        {type === "update" ? <h1>Update {van.year} {van.make} {van.model}</h1> : <h1>Add a van</h1>}
        <p id="form-steps">{page + 1} of {Object.keys(title).length} steps {page + 1 !== Object.keys(title).length && <span style={{color: "grey"}}> | Next: {title[page+1]}</span>}</p>
        <FormBar page={page}/>
      </header>
      <div>
        <h3>{title[page]}</h3>
      </div>
      <FormInputs type={type}/>

      <div className="van-form-btns-div">
        {page !== 0 && (
          <button id="prev" type="button" className="submit-btn" onClick={handlePrev}>
            <LeftArrow />
            Prev
          </button>
        )}
        {Object.keys(title).length - 1 !== page && (
          <button id="next" type="button" className="submit-btn" onClick={handleNext}>
            Next
            <RightArrow />
          </button>
        )}
        {page == Object.keys(title).length - 1 && (
          <button id="add-van" className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Loading..." : type === "update" ? "Update van" : "Add van"}
          </button>
        )}
      </div>
    </form>
  );
};
