"use client";

import React, { useState } from "react";
import { Category, Product } from "@/lib/types";
import { saveCategoryAction, deleteCategoryAction } from "./actions";
import { Edit, Plus, Trash2, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export function CategoriesClient({ categories, products }: { categories: Category[], products: Product[] }) {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [heroHeadline, setHeroHeadline] = useState("");
  const [heroSubheadline, setHeroSubheadline] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category);
    setIsAdding(false);
    setName(category.name);
    setSlug(category.slug);
    setDescription(category.description || "");
    setImage(category.image || "");
    setHeroHeadline(category.heroHeadline || "");
    setHeroSubheadline(category.heroSubheadline || "");
    setSortOrder(category.sortOrder || 0);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setHeroHeadline("");
    setHeroSubheadline("");
    setSortOrder(0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const catData: Partial<Category> = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description,
      image,
      heroHeadline,
      heroSubheadline,
      sortOrder,
    };
    await saveCategoryAction(editingCategory ? editingCategory.slug : null, catData);
    setEditingCategory(null);
    setIsAdding(false);
  };

  // The 6 main storefront categories we want to highlight/manage
  const mainSlugs = ["new-in", "men", "women", "maternity", "baby-kids", "loungewear"];
  
  // Sort categories by sortOrder if available, or just push main slugs first
  const displayCategories = [...categories].sort((a, b) => {
    if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
      return a.sortOrder - b.sortOrder;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Categories</h1>
          <p className="mt-2 text-brand-muted dark:text-white/60">Manage storefront categories and their hero sections.</p>
        </div>
        <button
          onClick={handleStartAdd}
          className="flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {displayCategories.map((cat) => {
          const count = products.filter(p => p.category === cat.name || p.category === cat.slug).length;
          return (
            <div
              key={cat.slug}
              className="rounded-brand border border-brand-border bg-white overflow-hidden flex flex-col dark:border-white/10 dark:bg-white/5"
            >
              <div 
                className="h-32 bg-brand-paper w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${cat.image || '/placeholder.jpg'})` }}
              ></div>
              <div className="p-6 flex flex-col flex-1">
                <div>
                  <h2 className="font-display text-2xl font-semibold">{cat.name}</h2>
                  <p className="mt-1 font-mono text-xs text-brand-teal">/{cat.slug}</p>
                  <p className="mt-3 text-sm text-brand-muted dark:text-white/60 line-clamp-2">
                    {cat.description || "No description provided."}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-brand-ink/70 dark:text-white/50 uppercase tracking-wider">
                    {count} Products
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-2 border-t border-brand-border dark:border-white/10 pt-4 flex-1 justify-end">
                  {mainSlugs.includes(cat.slug) && (
                    <Link
                      href={`/admin/catalogue/${cat.slug}`}
                      className="flex w-full items-center justify-center gap-2 rounded-brand bg-brand-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
                    >
                      Manage Products <ArrowRight size={16} />
                    </Link>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <button
                      onClick={() => handleStartEdit(cat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-brand-paper dark:hover:bg-white/10 text-sm font-medium text-brand-muted hover:text-brand-ink transition"
                    >
                      <Edit size={14} /> Edit Category
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete category ${cat.name}?`)) {
                          deleteCategoryAction(cat.slug);
                        }
                      }}
                      className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-brand-muted hover:text-red-600 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Overlay Dialog */}
      {(editingCategory || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsAdding(false);
              }}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">
              {isAdding ? "Add Category" : `Edit ${editingCategory?.name}`}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Category Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Slug</label>
                  <input
                    type="text"
                    placeholder="Auto-generated if blank"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Hero Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Sort Order</label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Hero Headline</label>
                <input
                  type="text"
                  value={heroHeadline}
                  onChange={(e) => setHeroHeadline(e.target.value)}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Hero Subheadline</label>
                <input
                  type="text"
                  value={heroSubheadline}
                  onChange={(e) => setHeroSubheadline(e.target.value)}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div className="pt-4 border-t border-brand-border dark:border-white/10 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setIsAdding(false);
                  }}
                  className="px-4 py-2 border border-brand-border rounded-full text-sm font-semibold hover:bg-brand-paper dark:border-white/10 dark:hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-teal text-white rounded-full text-sm font-semibold hover:bg-brand-teal-light"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
