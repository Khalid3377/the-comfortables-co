"use client";

import React, { useState } from "react";
import { BlogPost } from "@/lib/types";
import { saveBlogPostAction, deleteBlogPostAction } from "./actions";
import { Edit, Plus, Trash2, X, Eye, EyeOff } from "lucide-react";

export function BlogClient({ posts }: { posts: BlogPost[] }) {
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(true);

  const handleStartEdit = (post: BlogPost) => {
    setEditingPost(post);
    setIsAdding(false);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setImage(post.image);
    setPublished(post.published);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingPost(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContent("");
    setImage("/images/journal/placeholder.jpg");
    setPublished(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const postData: Partial<BlogPost> = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      excerpt,
      content,
      image,
      published,
    };
    await saveBlogPostAction(editingPost ? editingPost.slug : null, postData);
    setEditingPost(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Journal / Blog</h1>
          <p className="mt-2 text-brand-muted dark:text-white/60">Publish and edit articles about comfort and styling.</p>
        </div>
        <button
          onClick={handleStartAdd}
          className="flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-teal-light"
        >
          <Plus size={16} /> Add Article
        </button>
      </div>

      <div className="rounded-brand border border-brand-border bg-white dark:border-white/10 dark:bg-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-border dark:border-white/10 bg-brand-paper dark:bg-white/5 text-xs font-semibold uppercase tracking-wider text-brand-muted dark:text-white/60">
              <th className="p-4">Title</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Excerpt</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-border dark:divide-white/10 text-sm">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-brand-paper/50 dark:hover:bg-white/5 transition">
                <td className="p-4 font-semibold">{post.title}</td>
                <td className="p-4 text-brand-muted dark:text-white/60 font-mono text-xs">/{post.slug}</td>
                <td className="p-4 text-brand-muted dark:text-white/60 truncate max-w-xs">{post.excerpt}</td>
                <td className="p-4 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      post.published
                        ? "bg-green-50 text-green-600 dark:bg-green-950/20"
                        : "bg-red-50 text-red-600 dark:bg-red-950/20"
                    }`}
                  >
                    {post.published ? <Eye size={12} /> : <EyeOff size={12} />}
                    <span className="ml-1">{post.published ? "Published" : "Draft"}</span>
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleStartEdit(post)}
                    className="p-2 rounded-full hover:bg-brand-paper dark:hover:bg-white/10 text-brand-muted hover:text-brand-ink transition"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete blog post: ${post.title}?`)) {
                        deleteBlogPostAction(post.slug);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 text-brand-muted hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit/Add Overlay Dialog */}
      {(editingPost || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-brand border border-brand-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-neutral-900 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => {
                setEditingPost(null);
                setIsAdding(false);
              }}
              className="absolute right-4 top-4 text-brand-muted hover:text-brand-ink dark:text-white/60 dark:hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-2xl font-semibold mb-6">
              {isAdding ? "Add Article" : `Edit Article`}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-muted mb-2">Content</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full rounded-brand border border-brand-border bg-brand-paper px-4 py-2.5 text-sm outline-none focus:border-brand-teal dark:border-white/10 dark:bg-white/5"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded border-brand-border text-brand-teal focus:ring-brand-teal"
                />
                <label htmlFor="published" className="text-sm font-semibold text-brand-muted">Publish Immediately</label>
              </div>

              <div className="pt-4 border-t border-brand-border dark:border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
