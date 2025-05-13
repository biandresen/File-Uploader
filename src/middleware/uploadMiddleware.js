import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// Optional: resolve absolute path to "uploads" folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadPath = path.join(__dirname, "../fileManagement/uploads");

const fileUploadLimit = 10 * 1024 * 1024; // 10MB limit
export const fileLimitInMb = fileUploadLimit / (1024 * 1024);

const upload = multer({ dest: uploadPath, limits: { fileSize: fileUploadLimit } });
export default upload;
