import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Optional: resolve absolute path to "uploads" folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../fileManagement/uploads");

const upload = multer({ dest: uploadPath, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit
export default upload;
