import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

let cachedVideos: string[] = [];
let isFetching = false;

async function scrapeVideos(handle: string): Promise<string[]> {
    try {
        const response = await fetch(`https://www.youtube.com/${handle}/videos`, { 
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();
        const videoIds = new Set<string>();
        // Regex to extract Video ID pattern in ytInitialData
        const regex = /"videoId":"([a-zA-Z0-9_ -]{11})"/g; 
        
        let match;
        while ((match = regex.exec(html)) !== null) {
            videoIds.add(match[1]);
        }
        return Array.from(videoIds);
    } catch (error) {
        console.error(`Error fetching videos for ${handle}:`, error);
        return [];
    }
}

async function updateVideoCache() {
    if (isFetching) return;
    isFetching = true;
    try {
        const [ids1, ids2] = await Promise.all([
            scrapeVideos('@shaitt1137'),
            scrapeVideos('@the88creator')
        ]);
        const combined = Array.from(new Set([...ids1, ...ids2]));
        if (combined.length > 0) {
            cachedVideos = combined;
        }
    } catch (e) {
        console.error("Failed to update cache", e);
    } finally {
        isFetching = false;
    }
}

app.get('/api/videos', async (req, res) => {
    if (cachedVideos.length === 0) {
        await updateVideoCache();
    } else {
        // Trigger background update
        updateVideoCache();
    }
    res.json({ videoIds: cachedVideos });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Since this is express 4, * is fine
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
