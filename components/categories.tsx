"use client"; // This is not standard JavaScript or TypeScript syntax. It appears to be a custom directive specific to your project.

import qs from "query-string"; // Importing the "query-string" library for working with query parameters in URLs.
import { cn } from "@/lib/utils"; // Importing a custom utility function from "@/lib/utils".
import { Category } from "@prisma/client"; // Importing the "Category" type from the Prisma client.
import { useRouter, useSearchParams } from "next/navigation"; // Importing the "useRouter" and "useSearchParams" hooks from the Next.js "navigation" package.

// Define a TypeScript interface for the "Categories" component's props.
interface CategoriesProps {
  data: Category[]; // It expects an array of "Category" objects as data.
}

// Define the "Categories" component as a functional component.
export const Categories = ({ data }: CategoriesProps) => {
  const router = useRouter(); // Initialize the router object from Next.js.
  const searchParams = useSearchParams(); // Get the search parameters from the URL.

  const categoryId = searchParams.get("categoryId"); // Get the "categoryId" parameter from the URL.

  const onClick = (id: string | undefined) => {
    // Define an onClick function that takes an ID (string or undefined).

    const query = { categoryId: id }; // Create a query object with the "categoryId" parameter.

    const url = qs.stringifyUrl(
      {
        url: window.location.href, // Get the current URL.
        query, // Include the query parameters.
      },
      { skipNull: true } // Skip null or undefined values when stringifying the URL.
    );

    router.push(url);
    // The code above constructs a new URL with the updated query parameters.
    // However, the "url" variable is not currently being used or returned.
  };

  return (
    // JSX code for rendering the Categories component.
    <div className="w-full overflow-x-auto space-x-2 flex p-1">
      <button
        onClick={() => onClick(undefined)}
        className={cn(
          `flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
          !categoryId ? "bg-primary/25" : "bg-primary/10"
        )}
      >
        Newest
      </button>
      {data.map((item) => (
        // Mapping over the "data" array to render buttons for each category.
        <button
          onClick={() => onClick(item.id)}
          key={item.id} // Using the "item.id" as the key for React's rendering optimization.
          className={cn(
            `flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition`,
            item.id === categoryId ? "bg-primary/25" : "bg-primary/10"
          )}
        >
          {item.name} {/* Displaying the name of each category. */}
        </button>
      ))}
    </div>
  );
};
