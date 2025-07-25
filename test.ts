import 'dotenv/config';
import { GET } from './src/lib/logic';

// Mock NextRequest for testing
class MockNextRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
        super(input, init);
    }
    
    // Add NextRequest properties that might be accessed
    get cookies() {
        return new Map();
    }
    
    get nextUrl() {
        return new URL(this.url);
    }
}

async function main() {
    try {
        // Create a mock NextRequest
        const mockReq = new MockNextRequest("http://localhost:3000/api/feeds") as any;
        
        const res = await GET(mockReq);
        const data = await res.json();
        
        console.log('=== RSS FEED HEADLINES ===');
        console.log(`Total headlines: ${data.headlines.length}`);
        
        console.log('\n=== HEADLINES PER SOURCE ===');
        data.amountBySource.sort((a: any, b: any) => b.amount - a.amount); // Sort by amount descending
        data.amountBySource.forEach((source: any) => {
            console.log(`${source.source}: ${source.amount} headlines`);
        });
        
        // Write to file for easier viewing
        const fs = require('fs');
        const output = {
            totalHeadlines: data.headlines.length,
            headlinesPerSource: data.amountBySource,
            headlines: data.headlines
        };
        
        fs.writeFileSync('headlines_output.json', JSON.stringify(output, null, 2));
        console.log('Full output saved to headlines_output.json');
        
        // The headlines now already include classification data from the GET function
        fs.writeFileSync('classified_headlines_output.json', JSON.stringify(data.headlines, null, 2));
        console.log('Classified output saved to classified_headlines_output.json');
        console.log('\n=== CLASSIFIED HEADLINES SAMPLE ===');
        data.headlines.slice(0, 10).forEach((item: any, idx: number) => {
            console.log(`${idx + 1}. [${item.normalized_topic}] ${item.translated_headline}`);
            console.log(`   Event: ${item.generalized_event}`);
            console.log(`   Region: ${item.region}`);
            console.log(`   Main Entity: ${item.main_entity}`);
            console.log('');
        });
        
        // Also show first 10 and last 10 headlines in console
        console.log('\n=== FIRST 10 HEADLINES ===');
        data.headlines.slice(0, 10).forEach((headline: any, index: number) => {
            console.log(`${index + 1}. ${headline.title}`);
            console.log(`   Source: ${headline.source}`);
            console.log(`   PubDate: ${headline.pubDate}`);
            console.log('');
        });
        
        console.log('\n=== LAST 10 HEADLINES ===');
        data.headlines.slice(-10).forEach((headline: any, index: number) => {
            const actualIndex = data.headlines.length - 10 + index;
            console.log(`${actualIndex + 1}. ${headline.title}`);
            console.log(`   Source: ${headline.source}`);
            console.log(`   PubDate: ${headline.pubDate}`);
            console.log('');
        });
        
    } catch (error) {
        console.error('Error testing GET function:', error);
    }
}

main().catch(console.error);