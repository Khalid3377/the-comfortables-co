import { getProducts, createProduct, updateProduct, deleteProduct, getProductBySlug } from "./lib/data/products";
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryBySlug } from "./lib/data/categories";
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, getBlogPostBySlug } from "./lib/data/blog";
import { getReviews, createReview, updateReviewStatus, deleteReview } from "./lib/data/reviews";
import { getDiscounts, createDiscount, updateDiscount, deleteDiscount, getDiscountByCode } from "./lib/data/discounts";
import { getCustomers, createCustomer, getCustomerById } from "./lib/data/customers";
import { getOrders, createOrder, updateOrderStatus, getOrderById } from "./lib/data/orders";

async function runTest() {
  const results: any = {};
  
  try {
    console.log("Testing Products...");
    const p1 = await createProduct({ slug: "test-prod", name: "T", category: "C", collection: "C", price: 1, colors: [], sizes: [], material: "", image: "", gallery: [], description: "", inventory: 1, stockBySize: {}, scores: { comfort: 1, breathability: 1, softness: 1 }, reviews: [], published: false });
    const pRead = await getProductBySlug("test-prod");
    await updateProduct("test-prod", { name: "T2" });
    const pRead2 = await getProductBySlug("test-prod");
    await deleteProduct("test-prod");
    const pRead3 = await getProductBySlug("test-prod");
    results.Products = (p1.slug === "test-prod" && pRead?.name === "T" && pRead2?.name === "T2" && pRead3 === null) ? "✔" : "✘";
  } catch(e: any) { results.Products = "✘ " + e.message; }

  try {
    console.log("Testing Categories...");
    const c1 = await createCategory({ slug: "test-cat", name: "C", image: "", description: "" });
    const cRead = await getCategoryBySlug("test-cat");
    await updateCategory("test-cat", { name: "C2" });
    const cRead2 = await getCategoryBySlug("test-cat");
    await deleteCategory("test-cat");
    const cRead3 = await getCategoryBySlug("test-cat");
    results.Categories = (c1.slug === "test-cat" && cRead?.name === "C" && cRead2?.name === "C2" && cRead3 === null) ? "✔" : "✘";
  } catch(e: any) { results.Categories = "✘ " + e.message; }

  try {
    console.log("Testing Blog...");
    const b1 = await createBlogPost({ slug: "test-blog", title: "B", excerpt: "", content: "", image: "", published: false, date: "" });
    const bRead = await getBlogPostBySlug("test-blog");
    await updateBlogPost("test-blog", { title: "B2" });
    const bRead2 = await getBlogPostBySlug("test-blog");
    await deleteBlogPost("test-blog");
    const bRead3 = await getBlogPostBySlug("test-blog");
    results.Blog = (b1.slug === "test-blog" && bRead?.title === "B" && bRead2?.title === "B2" && bRead3 === null) ? "✔" : "✘";
  } catch(e: any) { results.Blog = "✘ " + e.message; }

  try {
    console.log("Testing Reviews...");
    const r1 = await createReview({ id: "test-rev", productSlug: "test", productName: "test", name: "R", rating: 5, text: "", status: "pending", date: "" });
    let rs = await getReviews();
    const rRead = rs.find(r => r.id === "test-rev");
    await updateReviewStatus("test-rev", "approved");
    rs = await getReviews();
    const rRead2 = rs.find(r => r.id === "test-rev");
    await deleteReview("test-rev");
    rs = await getReviews();
    const rRead3 = rs.find(r => r.id === "test-rev");
    results.Reviews = (r1.id === "test-rev" && rRead?.status === "pending" && rRead2?.status === "approved" && !rRead3) ? "✔" : "✘";
  } catch(e: any) { results.Reviews = "✘ " + e.message; }

  try {
    console.log("Testing Discounts...");
    const d1 = await createDiscount({ code: "TEST10", type: "percentage", value: 10, usageLimit: 1, usageCount: 0, expiryDate: "", active: true });
    const dRead = await getDiscountByCode("TEST10");
    await updateDiscount("TEST10", { active: false });
    const dRead2 = await getDiscountByCode("TEST10");
    await deleteDiscount("TEST10");
    const dRead3 = await getDiscountByCode("TEST10");
    results.Discounts = (d1.code === "TEST10" && dRead?.active === true && dRead2?.active === false && dRead3 === null) ? "✔" : "✘";
  } catch(e: any) { results.Discounts = "✘ " + e.message; }

  try {
    console.log("Testing Customers...");
    const cu1 = await createCustomer({ id: "test-cust", name: "Cu", email: "test@example.com", phone: "", createdAt: "", joinedAt: "" });
    const cuRead = await getCustomerById("test-cust");
    // Customers are read-only except create, we don't test update/delete
    // Clean up manually from file
    results.Customers = (cu1.id === "test-cust" && cuRead?.name === "Cu") ? "✔" : "✘";
    const fs = require('fs');
    let data = JSON.parse(fs.readFileSync('./data/customers.json', 'utf8'));
    data = data.filter((c: any) => c.id !== "test-cust");
    fs.writeFileSync('./data/customers.json', JSON.stringify(data, null, 2));
  } catch(e: any) { results.Customers = "✘ " + e.message; }

  try {
    console.log("Testing Orders...");
    const o1 = await createOrder({ id: "test-ord", date: "", createdAt: "", customerName: "", customerEmail: "", customerPhone: "", shippingAddress: "", items: [], subtotal: 0, discount: 0, total: 0, status: "pending", paymentStatus: "Pending", fulfillmentStatus: "Unfulfilled" });
    const oRead = await getOrderById("test-ord");
    await updateOrderStatus("test-ord", "processing");
    const oRead2 = await getOrderById("test-ord");
    // Orders don't have delete exported, manually clean up
    results.Orders = (o1.id === "test-ord" && oRead?.status === "pending" && oRead2?.status === "processing") ? "✔" : "✘";
    const fs = require('fs');
    let data = JSON.parse(fs.readFileSync('./data/orders.json', 'utf8'));
    data = data.filter((o: any) => o.id !== "test-ord");
    fs.writeFileSync('./data/orders.json', JSON.stringify(data, null, 2));
  } catch(e: any) { results.Orders = "✘ " + e.message; }

  console.log(JSON.stringify(results, null, 2));
}

runTest();
