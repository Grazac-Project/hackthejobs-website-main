const ProductDetails = ({ fullDescription }) => {
  return (
    <div className=" pt-8">
      <h2 className="text-[20px] font-semibold text-[#000000] border-b border-[#EAEAEA] pb-4 mb-6">Details</h2>

      <div
        className="space-y-4 text-[14px] text-[#4F4F4F] leading-[160%]"
        dangerouslySetInnerHTML={{ __html: fullDescription }}
      />
    </div>
  );
};

export default ProductDetails;
