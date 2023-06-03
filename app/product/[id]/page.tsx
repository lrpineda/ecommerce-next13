import { SearchParamTypes } from "@/types/SearchParamTypes"
import formatPrice from "@/utils/PriceFormat"
import Image from "next/image"
import AddCart from "./AddCart"

export default async function Product(searchParams: SearchParamTypes) {
    
    return (
        <div className="flex flex-col xl:flex-row  items-center xl:items-start justify-between gap-16 ">
            <Image 
                src={searchParams.searchParams.image}
                alt={searchParams.searchParams.name}
                width={600}
                height={600}
                className='w-full rounded-lg'
                priority={true}
            />
            <div className="font-medium w-full">
                <h1 className="text-2xl py-2">{searchParams.searchParams.name}</h1>
                <p className="py-2">{searchParams.searchParams.description}</p>
                <p className="pt-2 text-secondary text-sm">What do I think:</p>
                <p className="pb-2">{searchParams.searchParams.features}</p>
            <div className="flex gap-2">
                <p className="font-bold text-primary">{formatPrice(searchParams.searchParams.unit_amount)}</p>
            </div>
            <AddCart 
                id={searchParams.params.id}
                name={searchParams.searchParams.name}
                unit_amount={searchParams.searchParams.unit_amount}
                image={searchParams.searchParams.image}
            />
            </div>
        </div>
    )
}