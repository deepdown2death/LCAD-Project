import React from "react";

const Loading = () => {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div className="animate-spin ease-linear rounded-full w-10 h-10 border-t-2 border-b-2 border-blue-500 ml-3"></div>
    </div>
  );
};

export default Loading;
