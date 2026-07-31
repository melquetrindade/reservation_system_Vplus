"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import Image from "next/image";

const ButtonSignin = () => {
  const handleLoginWithGoogleClick = () => {
    signIn("google", {
      callbackUrl: "/admin/dashboard",
    });
  };

  return (
    <Button className="mt-6 gap-3" onClick={handleLoginWithGoogleClick}>
      <Image alt="logo_google" src="/google.svg" height={20} width={20} />
      Google
    </Button>
  );
};

export default ButtonSignin;
