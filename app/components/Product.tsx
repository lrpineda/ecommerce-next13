import Image from "next/image";
import formatPrice from "@/utils/PriceFormat";
import ProductType from "@/types/ProductType";
import Link from "next/link";

export default function Product({
  id,
  name,
  image,
  unit_amount,
  description,
  metadata,
}: ProductType) {
  const { features } = metadata;
  return (
    <Link
      href={{
        pathname: `/product/${id}`,
        query: { name, image, unit_amount, id, description, features },
      }}
    >
      <div>
        <Image
          className="w-full h-96 object-cover rounded-lg"
          src={image}
          alt={name}
          width={800}
          height={800}
          priority={true}
        />
        <div className="font-medium py-2">
          <h1>{name}</h1>
          <span>{id}</span>
          <h2 className="text-sm text-primary">{formatPrice(unit_amount)}</h2>
        </div>
      </div>
    </Link>
  );
}
