import { supabase } from "../supabaseClient.js";

const SESSION_KEY = "session_user_id";

export async function recordCampaignWin(flagName) {
    if (!flagName) return;
    const uid = (typeof localStorage !== "undefined") ? localStorage.getItem(SESSION_KEY) : null;
    if (!uid) {
        console.warn("[campaignProgress] No session_user_id; cannot record flag.");
        return;
    }

    try {
        const { data, error } = await supabase
            .from("users")
            .select("flags")
            .eq("id", uid)
            .single();

        if (error) {
            console.warn("[campaignProgress] Failed to fetch flags", error);
            return;
        }

        const currentFlags = Array.isArray(data?.flags) ? data.flags.map(String) : [];
        if (currentFlags.includes(flagName)) {
            return; // already earned
        }

        const updated = [flagName, ...currentFlags];
        const { error: updErr } = await supabase
            .from("users")
            .update({ flags: updated })
            .eq("id", uid);

        if (updErr) {
            console.warn("[campaignProgress] Failed to update flags", updErr);
        } else {
            console.log(`[campaignProgress] Recorded campaign flag '${flagName}' for user ${uid}.`);
        }
    } catch (err) {
        console.warn("[campaignProgress] Unexpected error", err);
    }
}
