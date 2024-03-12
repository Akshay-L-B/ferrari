import React, { useEffect, useState } from 'react';
import connectDb from '../middleware/mongoose';
import User from '../models/User';
import Link from "next/link"
import { useRouter } from 'next/router';
const MyAccount = () => {
  const [userData, setUserData] = useState(null);
  const router = useRouter();
  useEffect(() => {
  const checkToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/');
      }
    } catch (error) {
      router.push("/");
    }
  };

  checkToken();
}, []);

const { userID } = router.query
  useEffect(() => {
  const fetchCourses = async () => {
    try {
      if (userID) {
        const response = await fetch(`/api/userdetails?UserID=${userID}`);
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  fetchCourses();
}, [userID]);
  return (
    <div>
      <section class="text-gray-600 body-font overflow-hidden">
        <div class="container px-5 py-24 mx-auto">
          <div class="lg:w-4/5 mx-auto flex flex-wrap">
            <div class="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
              <h1 class="text-gray-900 text-3xl title-font font-medium mb-4">PROFILE DETAILS</h1>
              <div class="flex mb-4">
                <a class="flex-grow border-b-2 border-gray-300 py-2 text-lg text-center px-1">Details</a>
              </div>

              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Name</span>
                <span class="ml-auto text-gray-900">{userData && userData.name}</span>
              </div>
              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Email</span>
                <span class="ml-auto text-gray-900">{userData && userData.email}</span>
              </div>
              <div class="flex border-t border-gray-200 py-2">
                <span class="text-gray-500">Phone Number</span>
                <span class="ml-auto text-gray-900">{userData && userData.phoneNo}</span>
              </div>
              <Link href={`/user?userID=${userID}`}>
              <div class="flex">
                <button class="flex ml-auto text-white bg-purple-700 border-0 py-2 px-6 focus:outline-none hover:bg-purple-500 rounded">DashBoard</button>
              </div>
              </Link>
            </div>
            <img alt="ecommerce" class="lg:w-1/2  lg:h-auto h-32 object-cover object-center rounded" src="https://dummyimage.com/400x400" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyAccount;
