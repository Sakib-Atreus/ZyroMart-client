import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';

const DynamicBreadcrumb = () => {
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === '/') {
    return null; 
  }

  const pathArray = pathname.split('/').filter((path) => path);

  return (
    <Breadcrumb className='max-w-7xl mx-auto px-4 text-md font-semibold' separator=">" style={{ color: 'white' }}> 
      <Breadcrumb.Item key="home">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
      {pathArray.map((path, index) => {
        const url = '/' + pathArray.slice(0, index + 1).join('/');

        const formattedPath = path.charAt(0).toUpperCase() + path.slice(1);
        const isActive = url === pathname;

        return (
          <Breadcrumb.Item key={url} style={{ color: isActive ? 'red' : 'green' }}>
            {isActive ? (
              <span>{formattedPath}</span> 
            ) : (
              <Link to={url}>{formattedPath}</Link> 
            )}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
