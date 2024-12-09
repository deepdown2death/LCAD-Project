import Loading from "@/components/Loading";
import { Textarea } from "@/components/ui/textarea";
import { selectRole } from "@/features/auth/authSlice";
import { addOrder } from "@/requests/order";
import { getOneProduct, addReview } from "@/requests/product";
import { Button, Rate } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const role = useSelector(selectRole);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProduct = async (id) => {
    const res = await getOneProduct(id);
    setProduct(res.content);
  };

  const handleAddReview = async () => {
    if (rating > 0 && comment.trim()) {
      setIsSubmitting(true);
      try {
        const res = await addReview(id, rating, comment);
        toast.success(res.message);
        setRating(0); // Reset rating
        setComment(""); // Reset comment
        getProduct(id); // Refresh product details
      } catch (error) {
        console.error("Error adding review:", error);
        toast.error("Failed to add review. Please try again.");
      } finally {
        setIsSubmitting(false); // Reset the submission state
      }
    } else {
      toast.warning("Please provide both a rating and a comment.");
    }
  };

  useEffect(() => {
    getProduct(id);
  }, [id]);

  if (!product) return <Loading />;

  const handleAddOrder = async () => {
    const data = {
      productId: product.id,
      price: product.price,
      preview: product.image,
    };

    const res = await addOrder(data);
    if (res.success) {
      toast.success(res.message);
      navigate("/");
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Product Image and Details */}
      <div className="col-span-1 flex bg-gray-100 items-center justify-center p-5">
        <img
          src={`data:image/jpeg;base64,${product.image}`}
          alt="Product Image"
          className="w-3/5"
        />
      </div>
      <div className="col-span-1 flex-col flex justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h1 className="text-xl capitalize font-semibold">{product.name}</h1>
            <div className="flex items-center gap-3">
              <p>({product.reviewCount})</p>
              <Rate disabled value={product.averageRating} />
            </div>
          </div>
          <div className="flex gap-1 mt-2">
            {product.sizes.map((size, index) => (
              <p
                key={index}
                className="bg-blue-500 rounded-full text-white px-3"
              >
                {size}
              </p>
            ))}
          </div>
        </div>
        <div>{product.description}</div>
        <div className="mt-4">
          <div className="flex items-center gap-3 justify-between">
            <p className="text-md font-semibold text-nowrap">
              Price: {product.price} DH
            </p>
            <Button
              className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2 capitalize"
              disabled={role === "ADMIN"}
              onClick={() => {
                handleAddOrder();
                
              }}
            >
              Add to your orders
            </Button>
          </div>
        </div>
      </div>

      {/* Display Existing Reviews */}
      <div className="mt-4 col-span-2">
        <h2 className="text-lg font-semibold mb-2">Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-md p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.user}</p>
                  <Rate disabled value={review.rating} />
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review!</p>
        )}
      </div>
      {/* Review Section */}
      {role !== "ADMIN" && (
        <div className="mt-4 col-span-2">
          <h2 className="text-lg font-semibold mb-2">Add a Review</h2>
          <Rate
            value={rating}
            onChange={setRating} // Update the rating state on change
          />
          <Textarea
            placeholder="Type your comment here."
            value={comment}
            onChange={(e) => setComment(e.target.value)} // Update the comment state
            className="mt-2"
          />
          <Button
            className="mt-2 w-full text-white bg-green-500 hover:bg-green-600 rounded-md py-2 capitalize"
            onClick={handleAddReview}
            loading={isSubmitting} // Show loading state when submitting
          >
            Submit Review
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
