import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { status } = await req.json()

    const submission = await prisma.contactSubmission.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error updating contact submission:", error)
    return NextResponse.json(
      { error: "Error updating contact submission" },
      { status: 500 }
    )
  }
} 