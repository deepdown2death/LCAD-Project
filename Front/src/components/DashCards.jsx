import React from "react";
import { Card, CardContent } from "./ui/card";

const DashCards = ({ title }) => {
  return (
    <Card className="min-w-full max-w-96 col-span-12 md:col-span-6 xl:col-span-3 gap-5">
      <CardContent className="pt-6">
        <div className="h-full flex justify-between items-center  min-h-12">
          <p className="font bold text-lg">{title}</p>
          <p className="font-bold">5</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashCards;
