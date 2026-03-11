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
        console.log("Google Sheets Webhook Response:", res.status, text);
    } catch (e) {
        console.error("Fetch to Google Sheets failed:", e);
    }
}

export async function onRequestPost({ request, env }) {
    try {
        const data = await request.json();
        const required = ["name", "email", "message"];
        if (!required.every(field => data[field])) {
            return new Response("Missing required fields", { status: 400 });
        }

        data.source = "contact_form";

        // Explicitly format data, including new fields
        const payload = {
            source: data.source,
            name: data.name,
            email: data.email,
            phone: data.phone || "Not provided",
            inquiryType: data.inquiryType || "Not specified",
            company: data.company || "Not provided",
            message: data.message
        };

        // 1. Send Email
        await sendNotificationEmail(env, "New Contact Request", payload);

        // 2. Append to Sheet
        await appendRowToSheet(env, payload);

        return new Response(JSON.stringify({ success: true }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        return new Response("Server Error", { status: 500 });
    }
}
