import Multer from "multer";
const storage = new Multer.memoryStorage();
export const upload = Multer({
  storage,
});
