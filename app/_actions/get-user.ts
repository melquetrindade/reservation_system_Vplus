"use server"

import {db} from "../_lib/prisma"

export const getUser = async (id: string) => {
    const user = await db.user.findUnique({
        where: {
            id
        }
    })

    return user
}