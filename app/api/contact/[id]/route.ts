import { NextResponse } from "next/server"
import connectDB from '@/lib/mongodb'
import ContactSubmission from '@/models/ContactSubmission'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const { id } = params
    const { status } = await req.json()

    const submission = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!submission) {
      return NextResponse.json(
        { error: "Contact submission not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Error updating contact submission:", error)
    return NextResponse.json(
      { error: "Error updating contact submission" },
      { status: 500 }
    )
  }
} 