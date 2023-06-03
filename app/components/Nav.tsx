"use client";

import { useCartStore } from "@/store";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "./Cart";
import { AiFillShopping } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import Themes from "./Themes";

export default function Nav({ user }: Session) {
  const cartStore = useCartStore();
  return (
    <nav className="flex justify-between items-center py-12">
      <Link href={"/"}>
        <h1 className="font-lobster text-xl">LuluFavs</h1>
      </Link>
      <ul className="flex items-center gap-6">
        <li
          onClick={() => cartStore.toggleCart()}
          className="flex items-center text-3xl relative cursor-pointer"
        >
          <AiFillShopping />

          <AnimatePresence>
            {cartStore.cart.length > 0 && (
              <motion.span
                className="bg-primary text-white text-sm font-bold w-5 h-5 rounded-full absolute left-4 bottom-4 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                {cartStore.cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        </li>
        <Themes />
        {!user && (
          <li className="bg-primary text-white py-2 px-4 rounded-md">
            <button onClick={() => signIn()}>Sign In</button>
          </li>
        )}
        {user && (
          <li>
            <div className="dropdown dropdown-end cursor-pointer">
              <Image
                className="rounded-full"
                src={user?.image as string}
                alt={user.name as string}
                width={36}
                height={36}
                tabIndex={0}
              />
              <ul tabIndex={0} className="dropdown-content menu p-4 space-y-4 shadow bg-base-100 rounded-box w-56">
                <Link 
                  className="hover:bg-base-300 p-4 rounded-md" 
                  href={'/dashboard'}
                  onClick={()=> {
                    if(document.activeElement instanceof HTMLElement){
                    document.activeElement.blur()
                  }}}
                  >
                    Orders
                </Link>
                <li 
                  className="hover:bg-base-300 p-4 rounded-md"
                  onClick={()=> {
                    signOut();
                    if(document.activeElement instanceof HTMLElement){
                    document.activeElement.blur()
                  }}}
                  >
                    Sign Out
                  </li>
              </ul>
            </div>
          </li>
        )}
      </ul>
      <AnimatePresence>{cartStore.isOpen && <Cart />}</AnimatePresence>
    </nav>
  );
}
