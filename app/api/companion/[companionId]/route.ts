import prismadb from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This function handles a PATCH request to update a companion's information.

export async function PATCH(
  req: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    // Parse the request body to extract the updated companion data.
    const body = await req.json();

    // Check if the user is authenticated and retrieve user information.
    const user = await currentUser();

    // Extract relevant data fields from the request body.
    const { name, description, instructions, seed, src, categoryId } = body;

    // Check if the 'companionId' parameter is provided in the request.
    if (!params.companionId) {
      return new NextResponse("Companion ID is required", { status: 400 });
    }

    // Check if the user is authenticated and has required user data.
    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if essential data fields are provided in the request.
    if (
      !src ||
      !name ||
      !description ||
      !instructions ||
      !categoryId ||
      !seed
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const isPro = await checkSubscription();

    if (!isPro) {
      return new NextResponse("Pro subscription required", {
        status: 403,
      });
    }

    // Update the companion's information in the database using Prisma.
    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId,
        userId: user.id,
      },
      data: {
        categoryId,
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
      },
    });

    // Return the updated companion data in the response.
    return NextResponse.json(companion);
  } catch (error) {
    // Handle any unexpected errors by logging them and returning an internal error response.
    console.log("[COMPANION_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { companionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const companion = await prismadb.companion.delete({
      where: {
        userId,
        id: params.companionId,
      },
    });

    return NextResponse.json(companion);
  } catch (error) {
    console.log("[COMPANION_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
