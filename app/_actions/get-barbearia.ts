"use server"

import {db} from '../_lib/prisma'

export const getBarbearia = async () => {
    const barbearia = await db.barbearia.findFirst()
    return barbearia
}