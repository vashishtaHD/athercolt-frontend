export default {
    async fetch(request, env) {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return this.handleOptions(request, env);
        }

        const url = new URL(request.url);

        // Health check
        if (url.pathname === "/api/health" && request.method === "GET") {
            return new Response(JSON.stringify({ ok: true }), {
                headers: this.getCorsHeaders(request, env),
            });
        }

        // Form Submissions
        if (url.pathname === "/api/contact" && request.method === "POST") {
            return this.handleContactSubmission(request, env);
        }

        if (url.pathname === "/api/applications" && request.method === "POST") {
            return this.handleCareerApplication(request, env);
        }

        return new Response("Not Found", { status: 404 });
    },

    handleOptions(request, env) {
        const headers = this.getCorsHeaders(request, env);
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Content-Type");
        return new Response(null, { headers });
    },

    getCorsHeaders(request, env) {
        const origin = request.headers.get("Origin");
        const allowedOrigins = (env.ALLOWED_ORIGINS || "").split(",");

        const headers = new Headers();
        if (allowedOrigins.includes(origin) || !origin) {
            headers.set("Access-Control-Allow-Origin", origin || "*");
        }
        return headers;
    },

    async handleContactSubmission(request, env) {
        try {
            const data = await request.json();
            const required = ["name", "email", "message"];
            if (!required.every(field => data[field])) {
                return new Response("Missing required fields", { status: 400 });
            }

            data.source = "contact_form";

            // 1. Send Email
            await this.sendNotificationEmail(env, "New Contact Request", data);

            // 2. Append to Sheet
            await this.appendRowToSheet(env, data);

            return new Response(JSON.stringify({ success: true }), {
                headers: this.getCorsHeaders(request, env)
            });
        } catch (e) {
            return new Response("Server Error", { status: 500 });
        }
    },

    async handleCareerApplication(request, env) {
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

                // Upload to R2
                const key = `resumes/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
                await env.RESUME_BUCKET.put(key, file.stream(), {
                    httpMetadata: { contentType: file.type }
                });

                // Use public URL if configured
                if (env.R2_PUBLIC_BASE_URL) {
                    resumeUrl = `${env.R2_PUBLIC_BASE_URL}/${key}`;
                } else {
                    resumeUrl = `(Private R2) Object Key: ${key}`;
                }
            }

            data.resumeInfo = resumeUrl;
            // Exclude file object from the JSON we send around
            delete data.resume;

            // 1. Send Email
            await this.sendNotificationEmail(env, `New Job Application: ${data.name}`, data);

            // 2. Append to Sheet
            await this.appendRowToSheet(env, data);

            return new Response(JSON.stringify({ success: true }), {
                headers: this.getCorsHeaders(request, env)
            });
        } catch (e) {
            return new Response("Server Error", { status: 500 });
        }
    },

    async sendNotificationEmail(env, subject, payload) {
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
                subject: `[${env.NOTIFY_SUBJECT_PREFIX}] ${subject}`,
                html: `<p>New submission from ${payload.source}:</p><p>${htmlBody}</p>`
            })
        });
    },

    async appendRowToSheet(env, payload) {
        if (!env.GOOGLE_SHEETS_WEBHOOK_URL || !env.GOOGLE_SHEETS_WEBHOOK_TOKEN) return;

        await fetch(env.GOOGLE_SHEETS_WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.GOOGLE_SHEETS_WEBHOOK_TOKEN}`
            },
            body: JSON.stringify(payload)
        });
    }
};
