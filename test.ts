import { getFeeds } from './src/lib/logic';

async function main() {
    const feeds = await getFeeds();
    console.log(feeds);
}

main().catch(console.error);