import { Card, CardContent } from "@/components/ui/card";

const AddImage = ({ handleImageChange, image }) => {
  return (
    <Card className="w-1/4 h-56">
      <CardContent className="h-full pt-6">
        <input
          type="file"
          id="productImage"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
        <label htmlFor="productImage" className="cursor-pointer">
          {image ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="Selected"
                className="max-w-full min-h-40 max-h-[185px]"
              />
            </div>
          ) : (
            <div className="text-center h-full flex flex-col justify-around">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-12 h-12 text-gray-700 mx-auto mb-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">
                Upload Image
              </h5>
              <p className="text-sm text-gray-500">
                Choose a photo less than <b>5 MB</b> in <b>JPG, PNG, or WebP</b>{" "}
                format.
              </p>
            </div>
          )}
        </label>
      </CardContent>
    </Card>
  );
};

export default AddImage;
