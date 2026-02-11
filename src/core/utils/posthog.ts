"use server";

import { PostHog } from "posthog-node";

export async function capturePostHogEvent(event: {
    userId: string;
    event: string;
    properties?: any;
}) {
    const apiKey = process.env.WEB_POSTHOG_KEY;
    if (!apiKey) return;

    const posthog = new PostHog(apiKey, {
        flushAt: 1,
        flushInterval: 0,
        host: "https://us.i.posthog.com",
    });

    try {
        posthog.capture({
            distinctId: event.userId,
            event: event.event,
            properties: event.properties,
        });
    } finally {
        await posthog.shutdown();
    }
}
