import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const User = ({ logout }) => {
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
        }
      } catch (error) {
        router.push("/");
      }
    };

    checkToken();
  }, []);
  const { userID } = router.query;
  const [initialData1, setInitialData1] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState(initialData);
  const [filteredData1, setFilteredData1] = useState(initialData1);
  const [enrolledEvents, setEnrolledEvents] = useState([]);
  const [userData, setUserData] = useState(null);
  const [userDegree, setUserDegree] = useState(null);
  const [userBranch, setUserBranch] = useState(null);
  const handleEventClick = (EventID) => {
    const slug = `${EventID}`;
    router.push(`/showtickets/${slug}?UserID=${userID}`);
  };
  const handleEventEdit = (EventID) => {
    const slug = `${EventID}`;
    router.push(`/event/${slug}?UserID=${userID}`);
  };
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (userID) {
          const response = await fetch("/api/allEventsfilteruser", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ UserID: userID }),
          });
          const data = await response.json();
          setInitialData(data);
          setFilteredData(data);
          setNotifications(data);
        }
      } catch (error) {
        console.error("Error fetching the eventHost Events:", error);
      }
    };

    fetchEvents();
  }, [userID]);

  const [notifications1, setNotifications1] = useState([]);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        if (userDegree && userBranch && userID) {
          const response = await fetch(
            `/api/allEventsfilter?degree=${userDegree}&branch=${userBranch}&UserID=${userID}`
          );
          setInitialData1(data);
          setNotifications1(data);
          setFilteredData1(data);
        }
      } catch (error) {
        console.error("Error fetching the eventHost Events:", error);
      }
    };

    fetchEvents();
  }, [userDegree, userBranch, userID]);
  const handleEnroll = (Event) => {
    const currentDateTime = new Date();
    const deadline = new Date(Event.EventRegDeadline);
    if (currentDateTime > deadline) {
      toast.error(
        `Cannot enroll to the Event ${Event.EventID} Registration Deadline already passed!`,
        {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    } else {
      toast.success(`${Event.EventID} Event Has Been Added To Event Cart!`, {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setEnrolledEvents([...enrolledEvents, Event]);
    }
  };
  return (
    <>
      <div className="flex">
        <ToastContainer
          position="top-center"
          autoClose={1500}
          limit={5}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colors"
        />
        <div className="w-70 h-full-fixed">
          <aside className="flex flex-col w-64 h-full px-4 py-8 overflow-y-auto bg-white border-r rtl:border-r-0 rtl:border-l dark:bg-gray-900 dark:border-gray-700">
            <div className="flex flex-col justify-between flex-1 mt-6 w-full">
              <nav>
                <Link
                  href={`/user?userID=${userID}`}
                  className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md dark:bg-gray-800 dark:text-gray-200"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mx-4 font-medium">Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    router.push({
                      pathname: "/myAccount",
                      query: { userID: userID },
                    });
                  }}
                  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-4 font-medium">My Account</span>
                </button>
                <Link
                  href={{
                    pathname: "/Eventcart",
                    query: {
                      enrolledEvents: JSON.stringify(enrolledEvents),
                      userID,
                    },
                  }}
                  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mx-4 font-medium">
                    View Event Cart Requests
                  </span>
                </Link>

                <button
                  onClick={() => {
                    router.push({
                      pathname: "/dropEvent",
                      query: { userID: userID, email: userData.email },
                    });
                  }}
                  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-4 font-medium">Drop Hosted Event</span>
                </button>
                <button
                  onClick={() => {
                    router.push({
                      pathname: "/newevent",
                      query: { userID: userID },
                    });
                  }}
                  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-4 font-medium">New Event</span>
                </button>
                <button
                  onClick={() => {
                    router.push({
                      pathname: "/timetable_user",
                      query: { ID: userID },
                    });
                  }}
                  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 5V7M15 11V13M15 17V19M5 5C3.89543 5 3 5.89543 3 7V10C4.10457 10 5 10.8954 5 12C5 13.1046 4.10457 14 3 14V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V14C19.8954 14 19 13.1046 19 12C19 10.8954 19.8954 10 21 10V7C21 5.89543 20.1046 5 19 5H5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="mx-4 font-medium">Time Table</span>
                </button>

                <hr className="my-6 border-gray-200 dark:border-gray-600" />

                <button
                  onClick={logout}
                  className="flex items-center px-4 py-2 mt-5 text-gray-600 transition-colors duration-300 transform rounded-md dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 hover:text-gray-700"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.3246 4.31731C10.751 2.5609 13.249 2.5609 13.6754 4.31731C13.9508 5.45193 15.2507 5.99038 16.2478 5.38285C17.7913 4.44239 19.5576 6.2087 18.6172 7.75218C18.0096 8.74925 18.5481 10.0492 19.6827 10.3246C21.4391 10.751 21.4391 13.249 19.6827 13.6754C18.5481 13.9508 18.0096 15.2507 18.6172 16.2478C19.5576 17.7913 17.7913 19.5576 16.2478 18.6172C15.2507 18.0096 13.9508 18.5481 13.6754 19.6827C13.249 21.4391 10.751 21.4391 10.3246 19.6827C10.0492 18.5481 8.74926 18.0096 7.75219 18.6172C6.2087 19.5576 4.44239 17.7913 5.38285 16.2478C5.99038 15.2507 5.45193 13.9508 4.31731 13.6754C2.5609 13.249 2.5609 10.751 4.31731 10.3246C5.45193 10.0492 5.99037 8.74926 5.38285 7.75218C4.44239 6.2087 6.2087 4.44239 7.75219 5.38285C8.74926 5.99037 10.0492 5.45193 10.3246 4.31731Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span className="mx-4 font-medium">Logout</span>
                </button>
              </nav>
              <div className="mt-1">
                <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  Upcoming Event Dates
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Event Code
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-medium font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                          Date and Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications1
                        .filter(
                          (notification) =>
                            new Date(notification.EventRegDeadline) > new Date()
                        )
                        .map((notification, index) => {
                          const currentDateTime = new Date();
                          const deadline = new Date(
                            notification.EventRegDeadline
                          );
                          const timeDifference = deadline - currentDateTime;
                          const days = Math.floor(
                            timeDifference / (1000 * 60 * 60 * 24)
                          );
                          const hours = Math.floor(
                            (timeDifference % (1000 * 60 * 60 * 24)) /
                              (1000 * 60 * 60)
                          );
                          const minutes = Math.floor(
                            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
                          );

                          return (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-100 dark:text-gray-900">
                                  {notification.EventID}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-500 dark:text-gray-900">
                                  {`${days} days ${hours} hours ${minutes} minutes`}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </aside>
        </div>
        <div className="w-4/5">
          <section className="container px-6 w-70" style={{ height: "400px" }}>
            <div className="mt-6 md:flex md:items-center md:justify-between">
              <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                  Hosting Events
                </button>
              </div>
            </div>
            <div className="flex flex-col mt-6">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th
                            scope="col"
                            className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Event Title
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Event Type
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Event Location
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Event Dates
                          </th>
                          <th
                            scope="col"
                            className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Maximum Attendance
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Current Revenue
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            Edit
                          </th>
                          <th
                            scope="col"
                            className="px-12 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                          >
                            View Event Feedback
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredData &&
                          filteredData.map(
                            (
                              Event //Go through the enrolled Events for the particualr studnet and create a table
                            ) => (
                              <tr key={Event.EventID}>
                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                  <div>
                                    <h2 className="font-medium text-gray-800 dark:text-white ">
                                      {Event.EventName}
                                    </h2>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                  <div>
                                    <h2 className="font-medium text-gray-800 dark:text-white ">
                                      {Event.EventType}
                                    </h2>
                                  </div>
                                </td>
                                <td className="px-2 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                  <div>
                                    <h4 className="text-gray-700 dark:text-gray-200">
                                      {Event.Description}
                                    </h4>
                                  </div>
                                </td>
                                <td className="px-2 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                  <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                    {Event.Location}
                                  </div>
                                </td>
                                <td className="px-2 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                  <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                    {Event.EventDate}
                                  </div>
                                </td>

                                <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                  <h4 className="text-gray-700 dark:text-gray-200">
                                    {Event.MaximumAttendance}
                                  </h4>
                                </td>
                                <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                  <h4 className="text-gray-700 dark:text-gray-200">
                                    {Event.CurrentRevenue}
                                  </h4>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                  <div>
                                    <button
                                      class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                      onClick={() =>
                                        handleEventEdit(Event.EventID)
                                      }
                                    >
                                      Edit
                                    </button>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                  <div>
                                    <button
                                      class="px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                                      onClick={() =>
                                        handleEventClick(Event.EventID)
                                      }
                                    >
                                      View Event Feedback
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="w-full">
            <section
              className="container px-6 w-70 "
              style={{ height: "400px" }}
            >
              <div className="mt-6 md:flex md:items-center md:justify-between">
                <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700">
                  <button className="px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-200 bg-gray-100 sm:text-sm dark:bg-gray-800 dark:text-gray-300">
                    Events Attending/Invited
                  </button>
                </div>
              </div>
              <div className="flex flex-col mt-6">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Event Title
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Description
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Event Location
                            </th>
                            <th
                              scope="col"
                              className="px-5 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Event Dates
                            </th>
                            <th
                              scope="col"
                              className="px-15 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Event Registration Deadline
                            </th>
                            <th
                              scope="col"
                              className="px-7 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Event Host
                            </th>
                            <th
                              scope="col"
                              className="px-7 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Give Event Feedback
                            </th>
                            <th
                              scope="col"
                              className="px-7 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Register Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredData1.map((Event) => (
                            <tr key={Event.EventID}>
                              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {Event.EventID}
                                  </h2>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                <div className="inline px-3 py-1 text-sm font-normal text-gray-500 bg-gray-100 rounded-full dark:text-gray-400 gap-x-2 dark:bg-gray-800">
                                  {Event.EventName}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div>
                                  <h4 className="text-gray-700 dark:text-gray-200">
                                    {Event.description}
                                  </h4>
                                </div>
                              </td>
                              <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div className="flex items-center">
                                  <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                    {Event.NoLectures}
                                  </p>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div className="flex items-center">
                                  <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                    {Event.NoPracticals}
                                  </p>
                                </div>
                              </td>
                              <td className="px-20 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div className="flex items-center">
                                  <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">
                                    {new Date(
                                      Event.EventRegDeadline
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </td>
                              <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div className="flex items-center">
                                  <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">
                                    {Event.RequiredCredits}
                                  </p>
                                </div>
                              </td>
                              <td className="px-8 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div className="flex items-center">
                                  <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600">
                                    {Event.RequiredCGPA}
                                  </p>
                                </div>
                              </td>
                              <td className="px-10 py-4 text-sm whitespace-nowrap dark:bg-gray-900">
                                <div className="flex items-center">
                                  <p className="flex items-center justify-center w-6 h-6 -mx-1 text-s text-blue-600 bg-blue-100 border-2 border-white rounded-full">
                                    {Event.credits}
                                  </p>
                                </div>
                              </td>

                              <td className="px-8 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {Event.eventHost}
                                  </h2>
                                </div>
                              </td>
                              <td className="px-8 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                <div>
                                  <h2 className="font-medium text-gray-800 dark:text-white ">
                                    {Event.EventType}
                                  </h2>
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap dark:bg-gray-900">
                                <div>
                                  <button
                                    onClick={() => handleEnroll(Event)}
                                    className="px-6 py-2 font-medium tracking-wide text-white capitalize bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80 rounded-lg"
                                  >
                                    Register
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};
export default User;
