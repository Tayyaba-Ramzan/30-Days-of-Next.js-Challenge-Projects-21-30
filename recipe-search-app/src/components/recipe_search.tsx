"use client";

import React, { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SearchIcon } from "lucide-react";
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image";

interface Recipe {
  uri: string;
  label: string;
  image: string;
  ingredientLines: string[];
  ingredients: { text: string }[];
  url: string;
}

const examples = [
  "Spaghetti",
  "Biryani",
  "Chicken Karahi",
  "Pizza",
  "Nihari",
  "Haleem",
  "Chapli Kabab",
];

export default function RecipeSearch() {
  const [query, setQuery] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setRecipes([]);
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`
      );
      const data = await response.json();
      setRecipes(data.hits.map((hit: { recipe: Recipe }) => hit.recipe));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-7xl mx-auto p-4 md:p-6 bg-gray-100">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 italic">Recipe Search</h1>
        <p className="text-lg text-gray-600 mb-4 italic">
          Discover amazing recipes using ingredients you already have.
        </p>
        <div className="mb-6">
          <p className="text-gray-600 italic">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((example) => (
              <span
                key={example}
                className="px-4 py-2 bg-[#ff2b85] text-white rounded-full cursor-pointer hover:bg-[#c21760] transition"
                onClick={() => setQuery(example)}
              >
                {example}
              </span>
            ))}
          </div>
        </div>
        <form className="relative w-full max-w-lg mx-auto" onSubmit={handleSearch}>
          <Input
            type="search"
            placeholder="Search by ingredient..."
            className="pr-12 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#ff2b85] italic w-full"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <SearchIcon className="w-6 h-6 text-[#ff2b85]" />
          </Button>
        </form>
      </header>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col justify-center items-center w-full h-full fixed inset-0 bg-white bg-opacity-50 z-50">
          <ClipLoader color="#ff2b85" loading={loading} size={50} />
          <p className="mt-4 text-lg text-gray-800 font-semibold">Loading recipes...</p>
          <div className="animate-pulse mt-2">
            <p className="text-gray-600">Fetching the best recipes for you...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {searched && recipes.length === 0 && (
            <p className="col-span-3 text-center text-xl text-gray-600">
              No recipes found. Try searching with different ingredients.
            </p>
          )}

          {/* Recipe Cards */}
          {recipes.map((recipe) => (
            <Card
              className="group relative bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105"
              key={recipe.uri}
            >
              <div className="relative w-full h-56">
                <Image
                  src={recipe.image}
                  alt={recipe.label}
                  width={500}
                  height={400}
                  className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity"></div>
              </div>
              <CardContent className="p-4">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{recipe.label}</h2>
                <p className="text-gray-500 line-clamp-2">{recipe.ingredientLines.join(", ")}</p>
              </CardContent>
              <Link href={recipe.url} className="absolute inset-0 z-10" prefetch={false}>
                <span className="sr-only">View recipe</span>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
