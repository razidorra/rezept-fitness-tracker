import "dotenv/config";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;
process.env.CLERK_PUBLISHABLE_KEY ||= process.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!process.env.MONGODB_URI || !process.env.CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
  console.error("MONGODB_URI, CLERK_PUBLISHABLE_KEY und CLERK_SECRET_KEY müssen gesetzt sein");
  process.exit(1);
}

await connectDB();
const { createApp } = await import("./app.js");
const app = createApp();
app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
