"use server"

import {db} from '../_lib/prisma'

export const getOwner = async (userEmail: string) => {
    const isOwner = await db.administrador.findMany({
        where: {
            role: "OWNER",
            email: userEmail
        }
    })

    if(isOwner){
        return true
    }
    return false
}

export const getAdmin = async () => {
    const administrators = await db.administrador.findMany({
        where: {
            role: "ADMIN"
        }
    })
    return administrators
}