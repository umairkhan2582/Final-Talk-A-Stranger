import express, { type Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import fs from "fs";
import { setupWebSocket } from "./websocket";
import { getLocationNews } from "./news-service";
import { generateLocationContent } from "./ai-service";
import { contactFormSchema } from "@shared/schema";
import googleAuth from "./auth";
import { getUserProfile, saveUserProfile } from "./profile-storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(express.json());

  // Sitemap routes - serve directly from public/ directory
  const publicPath = path.resolve(import.meta.dirname, "..", "public");
  
  app.get("/sitemap.xml", (_req, res) => {
    const filePath = path.join(publicPath, "sitemap.xml");
    if (fs.existsSync(filePath)) {
      res.type("application/xml");
      res.sendFile(filePath);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  app.get("/sitemap-:type.xml", (req, res) => {
    const filePath = path.join(publicPath, `sitemap-${req.params.type}.xml`);
    if (fs.existsSync(filePath)) {
      res.type("application/xml");
      res.sendFile(filePath);
    } else {
      res.status(404).send("Sitemap not found");
    }
  });

  app.get("/robots.txt", (_req, res) => {
    const filePath = path.join(publicPath, "robots.txt");
    if (fs.existsSync(filePath)) {
      res.type("text/plain");
      res.sendFile(filePath);
    } else {
      res.status(404).send("robots.txt not found");
    }
  });

  // Google Auth route
  app.use("/auth", googleAuth);

  // Profile routes
  app.get("/profile/get", async (req, res) => {
    try {
      // Try to load profile by email or userId (default to "default_user")
      const email = req.query.email as string;
      const userId = req.query.userId as string;
      const profileKey = email || userId || "default_user";

      const profile = await getUserProfile(profileKey);
      if (profile) {
        res.json({
          userId: userId || "110453456",
          username: profile.username,
          birthday: profile.birthday || "1991-04-26",
          gender: profile.gender || "male",
          location: profile.location || "Lahore",
          avatar: profile.avatar || "",
          email: profile.email || "",
        });
      } else {
        // Return default profile
        res.json({
          userId: "110453456",
          username: "User",
          birthday: "1991-04-26",
          gender: "male",
          location: "Lahore",
          avatar: "",
          email: "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/profile/update", async (req, res) => {
    try {
      const { userId, email, username, birthday, gender, location, avatar, bio } = req.body;
      
      // Use email if available, otherwise use userId as the key
      const profileKey = email || userId || "default_user";

      await saveUserProfile(profileKey, {
        email: email || "",
        username: username || "User",
        birthday: birthday || "",
        gender: gender || "",
        location: location || "",
        avatar: avatar || "",
        bio: bio || "",
      });

      res.json({
        userId: userId || "110453456",
        username,
        birthday,
        gender,
        location,
        avatar,
        email: email || "",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // News API
  app.get("/api/news/:locationType/:locationName", async (req, res) => {
    try {
      const { locationType, locationName } = req.params;
      if (!["country", "city", "area"].includes(locationType)) {
        return res.status(400).json({ error: "Invalid location type" });
      }
      const news = await getLocationNews(locationName, locationType as any);
      res.json(news);
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Failed to fetch news" });
    }
  });

  // AI-generated content
  app.get("/api/content/:locationType/:locationName", async (req, res) => {
    try {
      const { locationType, locationName } = req.params;
      const { parent } = req.query;
      if (!["country", "city", "area"].includes(locationType)) {
        return res.status(400).json({ error: "Invalid location type" });
      }
      const content = await generateLocationContent(
        locationType as any,
        locationName,
        parent as string | undefined,
      );
      res.json(content);
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const result = contactFormSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          error: "Invalid form data",
          details: result.error.issues,
        });
      }
      const { name, email, subject, message } = result.data;
      console.log("=== New Contact Form Submission ===");
      console.log("From:", name, `(${email})`);
      console.log("Subject:", subject);
      console.log("Message:", message);
      console.log(
        "Send to: info@talkastranger.com and talkastranger.dubai@gmail.com",
      );
      console.log("===================================");
      res.json({ success: true, message: "Message received" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to process contact form" });
    }
  });

  // Create HTTP server (for WebSocket)
  const httpServer = createServer(app);

  // Setup WebSocket
  setupWebSocket(httpServer);

  return httpServer;
}
