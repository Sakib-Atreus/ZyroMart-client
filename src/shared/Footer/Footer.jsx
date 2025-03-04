const Footer = () => {
  return (
    <div className="bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <footer className="footer p-10 text-md font-semibold lg:py-24 md:py-24 flex flex-col lg:flex-row md:flex-row lg:justify-between md:justify-between justify-center lg:items-start md:items-start items-center">
          <aside className="hidden lg:block md:block">
            <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-2xl font-semibold ">
              ZyroMart
            </h1>
            <p>
              <br />
              Making the world a better place through constructing elegant
              hierarchies. <br />
              Providing reliable tech since 1992
            </p>
            <br />
            <nav className="grid grid-cols-3 gap-4">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </nav>
          </aside>

          {/* For mobile responsive  */}
          <nav className="flex flex-col justify-center items-center text-center lg:hidden md:hidden">
            <h1 className="bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent text-2xl font-semibold ">
              ZyroMart
            </h1>
            <p>
              <br />
              Making the world a better place through constructing elegant
              hierarchies. <br />
              Providing reliable tech since 1992
            </p>
            <br />
            <nav className="grid grid-cols-3 gap-4">
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
                </svg>
              </a>
              <a>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-current"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                </svg>
              </a>
            </nav>
          </nav>
          <nav className="flex flex-col items-center lg:items-start md:items-start">
            <h6 className="text-gray-500 lg:text-white lg:opacity-60 md:text-white md:opacity-60 font-bold text-xl lg:text-sm md:text-sm lg:footer-title md:footer-title">
              Services
            </h6>
            <div className="flex flex-row lg:flex-col md:flex-col gap-4 lg:gap-2 md:gap-2 underline lg:no-underline md:no-underline">
              <a className="link link-hover">Branding</a>
              <a className="link link-hover">Design</a>
              <a className="link link-hover">Marketing</a>
              <a className="link link-hover">Insights</a>
            </div>
          </nav>
          <nav className="flex flex-col items-center lg:items-start md:items-start">
            <h6 className="text-gray-500 lg:text-white lg:opacity-60 md:text-white md:opacity-60 font-bold text-xl lg:text-sm md:text-sm lg:footer-title md:footer-title">
              Support
            </h6>
            <div className="flex flex-row lg:flex-col md:flex-col gap-4 lg:gap-2 md:gap-2 underline lg:no-underline md:no-underline">
              <a className="link link-hover">Pricing</a>
              <a className="link link-hover">Documentation</a>
              <a className="link link-hover">Guides</a>
              <a className="link link-hover">API Status</a>
            </div>
          </nav>
          <nav className="flex flex-col items-center lg:items-start md:items-start">
            <h6 className="text-gray-500 lg:text-white lg:opacity-60 md:text-white md:opacity-60 font-bold text-xl lg:text-sm md:text-sm lg:footer-title md:footer-title">
              Company
            </h6>
            <div className="flex flex-row lg:flex-col md:flex-col gap-4 lg:gap-2 md:gap-2 underline lg:no-underline md:no-underline">
              <a className="link link-hover">About</a>
              <a className="link link-hover">Contact</a>
              <a className="link link-hover">Jobs</a>
              <a className="link link-hover">Press</a>
              <a className="link link-hover">Partners</a>
            </div>
          </nav>
          <nav className="flex flex-col items-center lg:items-start md:items-start">
            <h6 className="text-gray-500 lg:text-white lg:opacity-60 md:text-white md:opacity-60 font-bold text-xl lg:text-sm md:text-sm lg:footer-title md:footer-title">
              Legal
            </h6>
            <div className="flex flex-row lg:flex-col md:flex-col gap-4 lg:gap-2 md:gap-2 underline lg:no-underline md:no-underline">
              <a className="link link-hover">Claim</a>
              <a className="link link-hover">Privacy</a>
              <a className="link link-hover">Terms</a>
            </div>
          </nav>
        </footer>

        <div className="bg-base-200 mx-8">
          <hr className="opacity-15" />
        </div>
        <footer className="footer flex justify-between p-10">
          <aside>
            <p>
              {/* Copyright © {new Date().getFullYear()} - All right reserved by ACME
            Industries Ltd */}
              © {new Date().getFullYear()} ZyroMart Company, Inc. All rights reserved.
            </p>
          </aside>
          <p>Developed by Sakib</p>
        </footer>
      </div>
    </div>
  );
};

export default Footer;
