const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Map form "source" values to Brevo list IDs
const LISTS = {
  checklist: 12,
  cvprompt: 12, // change when you create a separate list
};

export async function onRequestPost({ request, env }) {
  if (!env.BREVO_API_KEY) {
    console.error("BREVO_API_KEY is not set");
    return json({ success: false, message: "Server configuration error." }, 500);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ success: false, message: "Invalid request." }, 400);
  }

  // Honeypot: real users leave this empty
  if (data.company) return json({ success: true, message: "Contact Added" });

  const name = String(data.name || "").trim().slice(0, 80);
  const email = String(data.email || "").trim().toLowerCase();
  const listId = LISTS[data.source] ?? 12;

  if (!EMAIL_RE.test(email)) {
    return json({ success: false, message: "Please enter a valid email address." }, 400);
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: name, SOURCE: data.source || "website" },
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (res.ok) return json({ success: true, message: "Contact Added" });

    console.error("Brevo error", res.status, await res.text());
    return json({ success: false, message: "Could not subscribe you right now. Please try again." }, 502);
  } catch (err) {
    console.error("Subscribe failed", err);
    return json({ success: false, message: "Something went wrong. Please try again." }, 500);
  }
}
