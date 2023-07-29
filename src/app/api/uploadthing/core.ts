import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const session = await getAuthSession();
 
      // If you throw, the user will not be able to upload
      if (!session?.user) throw new Error("Unauthorized");
        
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
        await db.user.update({
            where: {
                id: metadata.userId
            },
            data: {
                image: file.url,
            }
        })
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;