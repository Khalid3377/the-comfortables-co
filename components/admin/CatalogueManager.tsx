"use client";

import React, { useState, useTransition } from "react";
import { Product, Category } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { togglePublishAction, updateStockAction, deleteProductAction, saveProductAction } from "@/app/admin/products/actions";
import { Eye, EyeOff, Edit, Plus, Trash2, X } from "lucide-react";

type CatalogueManagerProps = {
  products: Product[];
  categories: Category[];
  categorySlug?: string;
  categoryName?: string;
};

export function CatalogueManager({ products, categories, categorySlug, categoryName }: CatalogueManagerProps) {
  const [filterTab, setFilterTab] = useState("All");
  const [isPending, startTransition] = useTransition();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [stockEditProduct, setStockEditProduct] = useState<Product | null>(null);

  // Form states for Add/Edit
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [image, setImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  const [newGalleryImage, setNewGalleryImage] = useState("");

  const handleStartEdit = (product: Product) => {
    setEditingProduct(product);
    setIsAdding(false);
    setName(product.name);
    setSlug(product.slug);
    setPrice(product.price);
    setDescription(product.description);
    setCategory(product.category);
    setSizes(product.sizes);
    setColors(product.colors);
    setImage(product.image);
    setGallery(product.gallery || []);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingProduct(null);
    setName("");
    setSlug("");
    setPrice(0);
    setDescription("");
    setCategory(categoryName || "");
    setSizes(["S", "M", "L", "XL"]);
    setColors(["Ink Black", "Cloud Gray", "Mist Teal"]);
    setImage("");
    setGallery([]);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Partial<Product> = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      price,
      description,
      category,
      sizes,
      colors,
      image,
      gallery,
    };
    if (isAdding) {
      // Default stock mapping
      const initialStock: Record<string, number> = {};
      sizes.forEach((s) => {
        initialStock[s] = 20;
      });
      productData.stockBySize = initialStock;
    }
    await saveProductAction(editingProduct ? editingProduct.slug : null, productData);
    setEditingProduct(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-brand-border dark:border-white/10 pb-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">{categoryName ? `${categoryName} Catalogue` : "Products"}</h1>
          {categoryName && (
            <div className="mt-2 text-xs font-semibold text-brand-muted uppercase tracking-wider">
              Admin &gt; Catalogue &gt; {categoryName}
            </div>
          )}
        </div>
        <button
          onClick={handleStartAdd}
          className="flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
        >
          <Plus size={16} /> Add Product {categoryName ? `to ${categoryName}` : ""}
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-brand-border dark:border-white/10 pb-4 overflow-x-auto">
        {["All", "Published", "Draft", "Low Stock", "Out of Stock"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`whitespace-nowrap px-1 py-2 text-sm font-semibold border-b-2 transition ${filterTab === tab ? "border-brand-teal text-brand-teal" : "border-transparent text-brand-muted hover:text-brand-ink dark:hover:text-white"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main product list */}
      <div className="rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border dark:border-white/10 bg-brand-paper dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60">
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Inventory</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border dark:divide-white/10 text-sm">
            {products
              .filter(p => !categoryName || p.category === categoryName)
              .filter(p => {
                if (filterTab === "Published") return p.published;
                if (filterTab === "Draft") return !p.published;
                if (filterTab === "Out of Stock") return p.inventory === 0;
                if (filterTab === "Low Stock") return p.inventory > 0 && p.inventory <= 10;
                return true;
              })
              .map((product) => {
              const totalStock = product.inventory;
              return (
                <tr key={product.slug} className="hover:bg-brand-paper/50 dark:hover:bg-white/5 transition">
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td className="p-4 text-brand-muted dark:text-white/60">{product.category}</td>
                  <td className="p-4">{formatCurrency(product.price)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setStockEditProduct(product)}
                      className="text-brand-teal font-semibold hover:underline"
                    >
                      {totalStock} units ({product.sizes.length} sizes)
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => startTransition(() => { togglePublishAction(product.slug, product.published); })}
                      disabled={isPending}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold disabled:opacity-60 ${
                        product.published
                          ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                          : "bg-red-50 text-red-600 dark:bg-red-950/20"
                      }`}
                    >
                      {product.published ? (
                        <>
                          <Eye size={12} /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={12} /> Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleStartEdit(product)}
                      className="p-2 rounded-full hover:bg-brand-paper dark:hover:bg-white/10 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white transition"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${product.name}?`)) {
                          startTransition(() => { deleteProductAction(product.slug); });
                        }
                      }}
                      disabled={isPending}
                      className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-brand-muted hover:text-red-600 dark:text-white/60 dark:hover:text-red-400 transition disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Overlay Dialog */}
      {(editingProduct || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAdding(false);
              }}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">
              {isAdding ? "Add Product" : `Edit ${editingProduct?.name}`}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Price (INR)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
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

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Category</label>
                <select
                  required
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === "__NEW__") {
                      window.location.href = "/admin/categories";
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                >
                  <option value="" disabled>Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.name}>{c.name}</option>
                  ))}
                  <option value="__NEW__">+ New Category</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Sizes</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {sizes.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 bg-brand-paper dark:bg-white/5 px-2.5 py-1 rounded text-xs font-semibold">
                      {s}
                      <button type="button" onClick={() => setSizes(sizes.filter((x) => x !== s))} className="text-red-500 hover:text-red-700">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="Add size"
                    className="rounded-brand border border-brand-border bg-brand-paper px-3 py-1.5 text-xs outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newSize && !sizes.includes(newSize)) {
                        setSizes([...sizes, newSize]);
                        setNewSize("");
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-teal text-white rounded text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Colors</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.map((c) => (
                    <span key={c} className="inline-flex items-center gap-1 bg-brand-paper dark:bg-white/5 px-2.5 py-1 rounded text-xs font-semibold">
                      {c}
                      <button type="button" onClick={() => setColors(colors.filter((x) => x !== c))} className="text-red-500 hover:text-red-700">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="Add color"
                    className="rounded-brand border border-brand-border bg-brand-paper px-3 py-1.5 text-xs outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newColor && !colors.includes(newColor)) {
                        setColors([...colors, newColor]);
                        setNewColor("");
                      }
                    }}
                    className="px-3 py-1.5 bg-brand-teal text-white rounded text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border dark:border-white/10 mt-4">
                <h3 className="font-semibold text-sm mb-4">Images</h3>
                <p className="text-xs text-brand-muted mb-4 italic">Paste an image URL — file upload coming after Supabase migration.</p>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Gallery URLs</label>
                  <div className="flex flex-col gap-2 mb-2">
                    {gallery.map((g, i) => (
                      <div key={i} className="flex items-center justify-between bg-brand-paper dark:bg-white/5 px-3 py-2 rounded text-xs">
                        <span className="truncate flex-1 font-mono">{g}</span>
                        <button type="button" onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 ml-2">×</button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newGalleryImage}
                      onChange={(e) => setNewGalleryImage(e.target.value)}
                      placeholder="Add gallery image URL"
                      className="flex-1 rounded-brand border border-brand-border bg-brand-paper px-3 py-2 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newGalleryImage && !gallery.includes(newGalleryImage)) {
                          setGallery([...gallery, newGalleryImage]);
                          setNewGalleryImage("");
                        }
                      }}
                      className="px-4 py-2 bg-brand-teal text-white rounded text-sm font-semibold"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border dark:border-white/10 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
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

      {/* Stock Edit Overlay Dialog */}
      {stockEditProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900">
            <button
              onClick={() => setStockEditProduct(null)}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">Edit Inventory: {stockEditProduct.name}</h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {stockEditProduct.sizes.map((size) => {
                const currentQty = stockEditProduct.stockBySize[size] ?? 0;
                return (
                  <div key={size} className="flex items-center justify-between border-b border-brand-border dark:border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="font-semibold text-lg">Size {size}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        defaultValue={currentQty}
                        onBlur={async (e) => {
                          const val = Number(e.target.value);
                          await updateStockAction(stockEditProduct.slug, size, val);
                        }}
                        className="w-20 rounded border border-brand-border bg-brand-paper px-2 py-1 text-center outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                      />
                      <span className="text-xs text-brand-muted">units</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border dark:border-white/10 flex justify-end">
              <button
                onClick={() => setStockEditProduct(null)}
                className="px-5 py-2 bg-brand-teal text-white rounded-full text-sm font-semibold hover:bg-brand-teal-light"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
