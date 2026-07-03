import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({ apiKey: process.env.TAVILY_API_KEY });


export const searchInternet = async ({ query }) => {
    try {
        if (!query || !query.trim()) {
            console.warn("searchInternet called with an empty or invalid query:", query);
            return { results: [] };
        }
        const response = await tavily.search(query.trim(), { maxResults: 5, searchDepth: "advanced" });
        console.log("Search Results: ", response);
        return response;
    } catch (error) {
        console.error("Error searching internet:", error);
        throw error;
    }
}