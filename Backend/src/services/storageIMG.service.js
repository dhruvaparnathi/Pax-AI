import { ImageKit, toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

export const uploadImage = async ({ buffer, fileName, fileType }) => {
    try {
        const response = await imagekit.files.upload({
            file: await toFile(Buffer.from(buffer), fileName),
            folder: "perplexity/chats",
            fileName: fileName,
        });
        return response;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}