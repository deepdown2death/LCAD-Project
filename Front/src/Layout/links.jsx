import { HomeIcon, Shirt } from "lucide-react";

const useSideLinks = () => {
  const sideLinks = [
    {
      path: "/",
      nom: "Dashboard",
      icon: <HomeIcon size={15} />,
    },
    {
      path: "/products",
      nom: "Products",
      icon: <Shirt size={15} />,
    },
  ];

  return sideLinks;
};

export default useSideLinks;
