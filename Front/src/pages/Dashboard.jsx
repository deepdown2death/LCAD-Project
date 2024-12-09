import React from "react";
import DashCards from "../components/DashCards";
import DashTable from "../components/DashTable";

const Dashboard = () => {
  return (
    <div className="min-h-full ">
      <div className="mt-5">
        <DashTable />
      </div>
    </div>
  );
};

export default Dashboard;
