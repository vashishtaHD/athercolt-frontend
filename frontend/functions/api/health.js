export async function onRequestGet({ env }) {
    return new Response(JSON.stringify({ ok: true }), {
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
