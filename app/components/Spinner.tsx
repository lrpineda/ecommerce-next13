'use client '

import { NewtonsCradle } from "@uiball/loaders";

export default function Spinner() {
    return (
        <div className="flex justify-center items-center h-screen">
            <NewtonsCradle size={40} speed={1.4} color="white" /> 
        </div>
    )
}