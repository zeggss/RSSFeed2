"use server"

import { NextRequest, NextResponse } from "next/server";
import OpenAI from 'openai';
import { feeds } from '../feeds';



export async function getFeeds() {
    return feeds
}

const FEED_LIMIT  = 10;
const HEADLINE_LIMIT = 5;

export async function GET(req: NextRequest) {
    let headlines: string[] = [];
    const parser = new DOMParser();
    await Promise.all(
        feeds.slice(0, FEED_LIMIT).map(async (feed) => {
            try {
                const res = await fetch(feed.url);
                const xml = await res.text();
                const doc = parser.parseFromString(xml, "application/xml");
                const items = doc.querySelectorAll("item");
                headlines = Array.from(items).slice(0, HEADLINE_LIMIT).map((item: any) => item.title).filter(Boolean);
            } catch (e) {
                headlines = [];
            }
        })
    )
    return NextResponse.json({ headlines });
}
