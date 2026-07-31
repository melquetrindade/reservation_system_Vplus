"use client"

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

// É CHAMADO NO LAYOUT.TSX (IMPORTANTE PARA AUTENTICAÇÃO COM O GOOGLE)
// OBS: O ARQUIVO PRECISA SER "USE CLIENT"
const AuthProvider = ({children}: {children: ReactNode}) => {
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
 
export default AuthProvider;