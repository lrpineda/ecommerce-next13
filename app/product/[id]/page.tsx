import { SearchParamTypes } from "@/types/SearchParamTypes"
import formatPrice from "@/utils/PriceFormat"
import Image from "next/image"
import AddCart from "./AddCart"

export default async function Product({searchParams}: SearchParamTypes) {
    
    return (
        <div className="flex justify-between gap-24 p-12 text-gray-700">
            <Image 
                src={searchParams.image}
                alt={searchParams.name}
                width={800}
                height={800}
            />
            <div className="font-medium text-gray-700">
                <h1 className="text-2xl py-2">{searchParams.name}</h1>
                <p className="py-2">{searchParams.description}</p>
                <p className="pt-2 text-gray-500 text-sm">What do I think:</p>
                <p className="pb-2">{searchParams.features}</p>
            <div className="flex gap-2">
                <p className="font-bold text-teal-700">{formatPrice(searchParams.unit_amount)}</p>
            </div>
            <AddCart {...searchParams} />
            </div>
        </div>
    )
}