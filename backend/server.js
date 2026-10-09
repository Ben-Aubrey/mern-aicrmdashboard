import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import leadRoutes from "./routes/lead.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import noteRoutes from "./routes/note.routes.js";
import taskRoutes from "./routes/task.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();
const frontendDist = resolve(dirname(fileURLToPath(import.meta.url)), "../frontend/dist");

/* ---------------------------- Middleware ---------------------------- */
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));


/* ---------------------------- Routes ---------------------------- */
app.get("/api/health", (req, res) => 
    res.json({ success: true, status: "ok", services: "TTP CRM API" })
);

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tasks", taskRoutes);

app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);


/* ------------------------ Frontend (production) ------------------------ */
if (process.env.NODE_ENV === "production") {
    app.use(express.static(frontendDist));
    app.get("*", (req, res, next) => {
        // Keep unknown API requests on the API 404 handler instead of returning the SPA.
        if (req.path === "/api" || req.path.startsWith("/api/")) return next();
        res.sendFile(resolve(frontendDist, "index.html"), (err) => {
            if (err) next(err);
        });
    });
}


/* ---------------------------- Error handling (last) ---------------------------- */
app.use(notFound);
app.use(errorHandler);

/* ----------------------------------- Boot ------------------------------------ */
const PORT = process.env.PORT || 8000;

const start = async () => {
    try {
        await connectDB();
        app.listen(PORT, () =>
            console.log(`🚀 TTP CRM API running on http://localhost: ${PORT}`)
        );
    } catch (err) {
        console.error("❌ Failed to start server: ", err.message);
        process.exit(1);
    }
};

start();

export default app;
