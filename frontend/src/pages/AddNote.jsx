import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { handleSuccess } from "../utils/toast.js";

const AddNote = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const id = params.id;

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;

      setIsLoading(true);
      setFetchError(null);

      try {
        const response = await fetch(`http://localhost:3000/editNote/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch note");
        }
        const data = await response.json();

        if (data.length > 0) {
          setValue("title", data[0].title);
          setValue("content", data[0].content);
          setValue("category", data[0].category);
        }
      } catch (err) {
        setFetchError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setFetchError(null);

    try {
      const url = id
        ? `http://localhost:3000/editNote/${id}`
        : "http://localhost:3000/addNote";
      const method = id ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(id ? "Failed to update note" : "Failed to add note");
      }

      const message = await response.json();
      handleSuccess(message.message);

      navigate("/");
    } catch (err) {
      setFetchError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl">Loading note...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          {id ? "Edit Note" : "Add New Note"}
        </h1>

        {fetchError && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-300">{fetchError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="title" className="block mb-2 text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter title"
                className={`w-full p-3 rounded-lg bg-gray-800 border ${
                  errors.title ? "border-red-500" : "border-gray-700"
                } focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="w-full sm:w-48">
              <label
                htmlFor="category"
                className="block mb-2 text-sm font-medium"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-1  focus:border-purple-500  focus:ring-purple-500 outline-none transition-colors"
                {...register("category", { required: "Category is required." })}
              >
                <option value="">Select a category</option>
                <option value="sports">Sports</option>
                <option value="study">Study</option>
                <option value="recipe">Recipe</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="ideas">Ideas</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block mb-2 text-sm font-medium">
              Content
            </label>
            <textarea
              id="content"
              placeholder="Enter your note content here..."
              rows={11}
              className={`w-full p-3 rounded-lg bg-gray-800 border resize-none ${
                errors.content ? "border-red-500" : "border-gray-700"
              }  focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-colors`}
              {...register("content", { required: "Content is required" })}
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-red-400">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-lg border border-gray-600 hover:bg-gray-800/50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg cursor-pointer bg-purple-600 hover:bg-purple-700 disabled:bg-blue-600/50 transition-colors flex items-center justify-center min-w-24"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {id ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{id ? "Update Note" : "Add Note"}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
