"use client";

import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

const SignInDialog = () => {
  const handleLoginWithGoogleClick = () => signIn("google");

  return (
    <>
      <DialogHeader>
        <DialogTitle>Faça login na plataforma</DialogTitle>
        <DialogDescription>
          Conecte-se usando sua conta do Google
        </DialogDescription>
      </DialogHeader>

      <Button
        variant="default"
        onClick={handleLoginWithGoogleClick}
        className="gap-2 font-bold"
      >
        <Image alt="google" src="/google.svg" width={18} height={18} priority />
        Google
      </Button>
    </>
  );
};

export default SignInDialog;
