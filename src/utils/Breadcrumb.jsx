import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Only show breadcrumb if the user is not on the home page
  if (pathname === '/') {
    return null; // Don't render the breadcrumb on the homepage
  }

  // Split the pathname into parts, ignoring empty strings
  const pathArray = pathname.split('/').filter((path) => path);

  return (
    <Breadcrumb className='max-w-7xl mx-auto px-4 text-md font-semibold' separator=">" style={{ color: 'white' }}> {/* Change separator to arrow */}
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      {pathArray.map((path, index) => {
        // Build the URL up to the current path
        const url = '/' + pathArray.slice(0, index + 1).join('/');

        // Format the path for display: capitalize the first letter
        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);

        // Check if this item is the active page
        const isActive = url === pathname;

        return (
          <Breadcrumb.Item key={url} style={{ color: isActive ? 'red' : 'green' }}>
            {isActive ? (
              <span>{formattedPath}</span> // Display plain text for active page
            ) : (
              <Link to={url}>{formattedPath}</Link> // Render link for non-active pages
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
