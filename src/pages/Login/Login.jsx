import React, { useState } from 'react';

const Login = () => {
    const [activeTab, setActiveTab] = useState("login");
    return (
        <div className="h-screen w-full flex justify-center items-center bg-cover bg-center bg-no-repeat relative">
      {/* Blur Background */}
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-md"></div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg w-96 z-10">
        {/* Header with Tabs */}
        <div className="tabs tabs-boxed flex justify-center">
          <a
            className={`tab ${activeTab === "login" ? "tab-active bg-primary text-white" : "text-gray-500"}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </a>
          <a
            className={`tab ${activeTab === "signup" ? "tab-active bg-primary text-white" : "text-gray-500"}`}
            onClick={() => setActiveTab("signup")}
          >
            Signup
          </a>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === "login" ? (
            <div>
              <h3 className="text-xl font-semibold mb-4">Login</h3>
              <form className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                />
                <button className="btn bg-primary text-white w-full">Login</button>
              </form>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold mb-4">Signup</h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="input input-bordered w-full"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered w-full"
                />
                <button className="btn bg-primary text-white w-full">Signup</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    );
};

export default Login;