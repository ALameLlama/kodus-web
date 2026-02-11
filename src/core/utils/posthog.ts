import { API_ROUTES } from "../config/constants";
import { axiosAuthorized } from "./axios";
import { pathToApiUrl } from "./helpers";

export function capturePostHogEvent(event: {
    userId: string;
    event: string;
    properties?: any;
}) {
    return axiosAuthorized.post(pathToApiUrl(API_ROUTES.posthogTrack), event);
}

/*
 * Backend implementation needed:
 * Create endpoint POST /posthog/track that receives { userId, event, properties }
 * and calls PostHog server-side to capture the event.
 * 
 * Example implementation (pseudo-code):
 * 
 * router.post('/posthog/track', async (req, res) => {
 *   const { userId, event, properties } = req.body;
 *   const posthog = new PostHog(process.env.WEB_POSTHOG_KEY);
 *   await posthog.capture({
 *     distinctId: userId,
 *     event: event,
 *     properties: properties
 *   });
 *   await posthog.shutdown();
 *   res.json({ success: true });
 * });
 */
