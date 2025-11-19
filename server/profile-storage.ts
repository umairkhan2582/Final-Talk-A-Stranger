import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "profiles.json");

// Profile interface for type safety
export interface Profile {
  userId: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  birthday?: string;
  gender?: string;
  location?: string;
}

// Load the database
async function load(): Promise<Record<string, Profile>> {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (err) {
    // File doesn't exist or invalid JSON, return empty database
    return {};
  }
}

// Save the database
async function save(db: Record<string, Profile>): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf8");
}

/**
 * Get a user profile by email
 * @param email - user's email
 * @returns Profile or null if not found
 */
export async function getUserProfile(email: string): Promise<Profile | null> {
  const db = await load();
  return db[email] || null;
}

/**
 * Save or update a user profile
 * @param email - user's email
 * @param profile - Profile object
 */
export async function saveUserProfile(
  email: string,
  profile: Profile,
): Promise<void> {
  const db = await load();
  db[email] = profile;
  await save(db);
}

/**
 * Optional: Delete a user profile by email
 * @param email - user's email
 */
export async function deleteUserProfile(email: string): Promise<void> {
  const db = await load();
  if (db[email]) {
    delete db[email];
    await save(db);
  }
}

/**
 * Optional: Get all profiles
 * @returns array of all Profile objects
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const db = await load();
  return Object.values(db);
}
