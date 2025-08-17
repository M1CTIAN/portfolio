import { kv } from '@vercel/kv';

// GET request handler: Fetches the current view count.
export async function GET() {
  try {
    // 'portfolio-views' is the key where we store our count.
    // If it doesn't exist, kv.get will return null, so we default to 0.
    const views = (await kv.get('portfolio-views')) || 0;
    
    return Response.json({ 
      views: parseInt(views, 10),
      message: "Views fetched successfully" 
    });
  } catch (error) {
    console.error('Error fetching views:', error);
    return Response.json(
      { error: "Failed to fetch views from Vercel KV." },
      { status: 500 }
    );
  }
}

// POST request handler: Increments the view count.
export async function POST() {
  try {
    // kv.incr() is a special function that atomically increments a number.
    // This is safer than reading and then writing, especially with many visitors.
    const newViews = await kv.incr('portfolio-views');
    
    return Response.json({ 
      views: newViews,
      message: "View recorded successfully" 
    });
  } catch (error) {
    console.error('Error recording view:', error);
    return Response.json(
      { error: "Failed to record view in Vercel KV." },
      { status: 500 }
    );
  }
}