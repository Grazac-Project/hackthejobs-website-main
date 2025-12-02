import Image from "next/image";

const ProductHero = ({ thumbnail, title }) => {
  return (
    <div className="w-full lg:w-full md:w-full">
      <div className="rounded-xl p-2 border-[1px] border-[#EDEDED] shadow-[1px_2px_8px_0px_rgba(0,0,0,0.05)]">
        <div className="overflow-hidden rounded-xl">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-[480px] lg:h-[400px] md:h-[350px] sm:h-[300px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductHero;
