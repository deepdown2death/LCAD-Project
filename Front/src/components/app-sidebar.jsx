import * as React from "react";
import { Sidebar } from "@/components/ui/sidebar";
import useSideLinks from "@/Layout/links";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar({ ...props }) {
  const sideLinks = useSideLinks();
  const location = useLocation();

  return (
    <Sidebar {...props}>
      <div className="mt-6">
        <ul className="space-y-4 mx-5">
          {sideLinks.map((link, index) => {
            const isActive = location.pathname === link.path; // Check if the current path matches
            return (
              <li key={index}>
                <Link
                  to={link.path}
                  className={`flex items-center space-x-2 ${
                    isActive
                      ? "text-blue-600 font-semibold"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {link.icon}
                  <span>{link.nom}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </Sidebar>
  );
}
