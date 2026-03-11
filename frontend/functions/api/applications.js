async function sendNotificationEmail(env, subject, payload) {
    if (!env.RESEND_API_KEY || !env.NOTIFY_TO_EMAIL || !env.NOTIFY_FROM_EMAIL) return;

    const htmlBody = Object.entries(payload)
        .map(([k, v]) => `<b>${k}:</b> ${v}`)
        .join("<br/>");

    await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            from: env.NOTIFY_FROM_EMAIL,
            to: env.NOTIFY_TO_EMAIL,
            subject: `[${env.NOTIFY_SUBJECT_PREFIX || "Website"}] ${subject}`,
            html: `<p>New submission from ${payload.source}:</p><p>${htmlBody}</p>`
        })
    });
}

async function appendRowToSheet(env, payload) {
    if (!env.GOOGLE_SHEETS_WEBHOOK_URL || !env.GOOGLE_SHEETS_WEBHOOK_TOKEN) return;

    try {
        const res = await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.GOOGLE_SHEETS_WEBHOOK_TOKEN}`
            },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log("Google Sheets Webhook Response (Careers):", res.status, text);
    } catch (e) {
        console.error("Fetch to Google Sheets failed:", e);
    }
}

export async function onRequestPost({ request, env }) {
    try {
        const formData = await request.formData();
        const data = Object.fromEntries(formData.entries());
        const file = formData.get("resume");

        const required = ["name", "email", "linkedin"];
        if (!required.every(field => data[field])) {
            return new Response("Missing required fields", { status: 400 });
        }

        data.source = "career_application";

        let resumeUrl = "No Resume Uploaded";
        if (file && typeof file === "object" && file.size > 0) {
            if (file.size > parseInt(env.MAX_RESUME_SIZE_BYTES || "10485760")) {
                return new Response("Resume too large", { status: 413 });
            }

            // Upload to R2 Bucket binding
            const key = `resumes/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
            if (env.RESUME_BUCKET) {
                await env.RESUME_BUCKET.put(key, file.stream(), {
                    httpMetadata: { contentType: file.type }
                });

                // Use public URL if configured
                if (env.R2_PUBLIC_BASE_URL) {
                    resumeUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;
                } else {
                    resumeUrl = `(Private R2) Object Key: ${key}`;
                }
            } else {
                resumeUrl = "R2 Bucket not bound";
                console.error("RESUME_BUCKET not found in environment");
            }
        }

        data.resumeInfo = resumeUrl;
        // Exclude file object from the JSON we send around
        delete data.resume;

        // 1. Send Email
        const jobName = data.jobTitle || "General Application";
        await sendNotificationEmail(env, `New Job Application (${jobName}): ${data.name}`, data);

        // 2. Append to Sheet
        await appendRowToSheet(env, data);

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        console.error(e);
        return new Response("Server Error", { status: 500 });
    }
}
