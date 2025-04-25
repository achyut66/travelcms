import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ items }) => {
  return (
    <nav className="text-sm text-gray-600 my-4 mb-[-45px]">
      <ol className="list-reset flex">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index !== 0 && <span className="mx-2">/</span>}
            {item.link ? (
              <Link
                to={item.link}
                className="px-3 py-1 rounded-md bg-gray-100 text-red-600 hover:bg-gray-200 underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="px-3 py-1 rounded-md bg-gray-300 text-gray-800 font-semibold">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
