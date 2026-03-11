

async function testWebhook() {
    const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    const token = process.env.GOOGLE_SHEETS_WEBHOOK_TOKEN;

    if (!url || !token) {
        console.error('Missing URL or Token in .dev.vars (which acts as .env here)');
        return;
    }

    console.log(`Testing webhook URL: ${url}`);
    console.log(`Using token: ${token}`);

    const testPayload = {
        source: "contact_form",
        name: "Test User",
        email: "test@example.com",
        phone: "123-456-7890",
        inquiryType: "Test Inquiry",
        company: "Test Company",
        message: "This is a test message from the Node script."
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(testPayload)
        });

        console.log(`\nResponse Status: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.log(`Response Body: ${text}`);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

testWebhook();
