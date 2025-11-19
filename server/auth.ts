import express, { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { saveUserProfile, getUserProfile, Profile } from "./profile-storage.js";

const router = express.Router();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * POST /auth/google-login
 * Receives Google credential from frontend, verifies it, and returns profile
 */
router.post("/google-login", async (req: Request, res: Response) => {
  try {
    const { credential } = req.body; // frontend sends `credential` from GoogleLogin

    if (!credential) {
      return res.status(400).json({ error: "Missing Google credential" });
    }

    // Verify credential with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ error: "Invalid Google credential" });
    }

    const email = payload.email;

    // Load existing profile
    let profile: Profile | null = await getUserProfile(email);

    // If profile doesn't exist, create a new one
    if (!profile) {
      profile = {
        email,
        username: payload.name || "New User",
        avatar: payload.picture || "",
        bio: "",
        birthday: "",
        gender: "",
        location: "",
      };
      await saveUserProfile(email, profile);
    }

    // Return profile to frontend
    res.json({
      success: true,
      profile,
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
});

/**
 * Optional: GET /auth/profile
 * Return all profile info for a logged-in user (if you want a separate endpoint)
 */
router.get("/profile/:email", async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const profile = await getUserProfile(email);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({ success: true, profile });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

export default router;
