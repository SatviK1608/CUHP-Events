import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import axios from "axios";
import { parseISO } from "date-fns";

const BookingForm = () => {
  const navigate = useNavigate();
  const [authStatus, setAuthStatus] = useState("");
  const { bookingId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    userId: "",
    eventManager: "",
    eventDateType: "",
    eventStartDate: "",
    eventEndDate: "",
    eventName: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    email: "",
    userType: "",
    bookedHallId: "",
    bookedHallName: "",
    organizingClub: "",
    phoneNumber: "",
    altNumber: "",
    isApproved: "",
  });

  const getbookingById = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/bookingsView/${bookingId}`,
        {
          withCredentials: true, // include credentials in the request
          headers: {
            Accept: "application/json",

            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data.booking;
      setIsLoading(false);
      setBookingData({
        ...bookingData,
        userId: data.userId,
        eventManager: data.eventManager,
        eventName: data.eventName,
        eventDateType: data.eventDateType,
        eventStartDate: data.eventStartDate
          ? data.eventStartDate.split("T")[0]
          : null,
        eventEndDate: data.eventEndDate
          ? data.eventEndDate.split("T")[0]
          : null,
        eventDate: data.eventDate ? data.eventDate.split("T")[0] : null,
        startTime: data.startTime
          ? data.startTime.split("T")[1].slice(0, 5)
          : null,
        endTime: data.endTime ? data.endTime.split("T")[1].slice(0, 5) : null,
        email: data.userId.email,
        userType: data.userId.userType,
        bookedHallId: data.bookedHallId,
        bookedHallName: data.bookedHallName,
        organizingClub: data.organizingClub,
        phoneNumber: data.phoneNumber,
        altNumber: data.altNumber,
        isApproved: data.isApproved,
      });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getbookingById();
  }, []);

  // handle change here

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setBookingData({ ...bookingData, [name]: value });
  };


  const bookingForm = async (e) => {
    e.preventDefault();
    const {
      eventManager,
      userId,
      eventName,
      eventDateType,
      eventStartDate,
      eventEndDate,
      eventDate,
      startTime,
      endTime,
      email,
      userType,
      bookedHallId,

      bookedHallName,
      organizingClub,
      phoneNumber,
      altNumber,
      isApproved,
    } = bookingData;

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_SERVER_URL}/bookingsEdit/${bookingId}`,
        {
          userId,
          eventManager,
          eventName,
          eventDateType,
          eventStartDate,
          eventEndDate,
          eventDate,
          startTime: parseISO(`2000-01-01T${startTime}:00.000Z`),
          endTime: parseISO(`2000-01-01T${endTime}:00.000Z`),
          email,
          userType,

          bookedHallId,
          bookedHallName,
          organizingClub,
          phoneNumber,
          altNumber,
          isApproved,
        },
        {
          withCredentials: true, // To include credentials in the request
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (!data) {
        toast.error("Request not send!");
      } else {
        toast.success("Request send Successfull!");
        navigate("/bookings");
      }
    } catch (error) {
      if (error.response.status === 422 && error.response) {
        const data = error.response.data;
        setAuthStatus(data.error);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <div className="max-w-screen-md mx-auto p-5 my-10 bg-white shadow-2xl shadow-blue-200">
            <div className="text-center mb-16">
              <p className="mt-4 text-sm leading-7 text-gray-500 font-regular uppercase">
                Update Booking
              </p>
              <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight text-gray-900">
                Update <span className="text-indigo-600">Booking </span>
              </h3>
            </div>

            <form method="POST" className="w-full">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    for="grid-event-manager"
                  >
                    Event Coordinator Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-event-manager"
                    type="text"
                    value={bookingData.eventManager}
                    name="eventManager"
                    onChange={handleInputs}
                    placeholder="Event Coordinator Name"
                  />
                </div>

                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-event-name"
                  >
                    Event Name
                  </label>
                  <input
                    value={bookingData.eventName}
                    name="eventName"
                    onChange={handleInputs}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-event-name"
                    type="text"
                    placeholder="Event Name"
                  />
                </div>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-organizing-club"
                  >
                    Organizing Club
                  </label>
                  <input
                    value={bookingData.organizingClub}
                    name="organizingClub"
                    onChange={handleInputs}
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-organizing-club"
                    type="text"
                    placeholder="Organizing Club"
                  />
                </div>

                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                    for="grid-event-date-type"
                  >
                    Event Date Type
                  </label>

                  <select
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="eventDateType"
                    name="eventDateType"
                    value={bookingData.eventDateType}
                    onChange={handleInputs}
                  >
                    <option value="">Select</option>
                    <option value="half">Half Day</option>
                    <option value="full">Full Day</option>
                    <option value="multiple">Miltiple Days</option>
                  </select>
                </div>
              </div>

              {bookingData.eventDateType === "multiple" && (
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-event-date"
                    >
                      Event Start Date
                    </label>
                    <input
                      value={bookingData.eventStartDate}
                      name="eventStartDate"
                      onChange={handleInputs}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-event-date"
                      type="date"
                      placeholder="Event Date"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-event-start-date"
                    >
                      Event End Date
                    </label>
                    <input
                      value={bookingData.eventEndDate}
                      name="eventEndDate"
                      onChange={handleInputs}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-event-end-date"
                      type="date"
                      placeholder="Event Date"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap -mx-3 mb-6">
                {(bookingData.eventDateType === "full" ||
                  bookingData.eventDateType === "half") && (
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-event-date"
                    >
                      Event Date
                    </label>
                    <input
                      value={bookingData.eventDate}
                      name="eventDate"
                      onChange={handleInputs}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-event-date"
                      type="date"
                      placeholder="Event Date"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                )}

                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    for="grid-hall-name"
                  >
                    Hall Name
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-300 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-hall-name"
                    type="text"
                    value={bookingData.bookedHallName}
                    name="bookedHallName"
                    onChange={handleInputs}
                    placeholder="Hall Name"
                    disabled
                  />
                </div>
              </div>

              {bookingData.eventDateType === "half" && (
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                      for="grid-start-time"
                    >
                      Start Time
                    </label>
                    <input
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-start-time"
                      type="time"
                      value={bookingData.startTime}
                      name="startTime"
                      onChange={handleInputs}
                      placeholder="Start Time"
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      for="grid-end-time"
                    >
                      End Time
                    </label>
                    <input
                      value={bookingData.endTime}
                      name="endTime"
                      onChange={handleInputs}
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-end-time"
                      type="time"
                      placeholder="End Time"
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    for="grid-phone-number"
                  >
                    Phone Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-phone-number"
                    type="number"
                    value={bookingData.phoneNumber}
                    name="phoneNumber"
                    onChange={handleInputs}
                    placeholder="Phone Number"
                  />
                </div>

                <div className="w-full md:w-1/2 px-3">
                  <label
                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 "
                    for="grid-alt-number"
                  >
                    Alternate Number
                  </label>
                  <input
                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    id="grid-alt-number"
                    type="number"
                    value={bookingData.altNumber}
                    name="altNumber"
                    onChange={handleInputs}
                    placeholder="Alternate Number"
                  />
                </div>
              </div>

              <div className="my-4">
                <p className="text-s text-red-600	 font-bold">{authStatus}</p>
              </div>

              <div className="flex flex-wrap -mx-3 mb-6">
                
                <div className="flex justify-between w-full px-3">
                  <button
                    onClick={bookingForm}
                    className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                    type="submit"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingForm;
