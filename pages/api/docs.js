import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const filePath = path.join(process.cwd(), "docs", "example.md");
  const content = fs.readFileSync(filePath, "utf8");

  res.status(200).json({ content });
}