import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export async function uploadImageToFirebase(file: File): Promise<string> {
  const fileRef = ref(storage, `posts/${Date.now()}-${file.name}`);
  const snapshot = await uploadBytes(fileRef, file);
  return await getDownloadURL(snapshot.ref);
}
