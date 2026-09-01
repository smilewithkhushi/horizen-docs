interface Env {
  BEEHIIV_API_KEY: string;
  PUBLICATION_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const { email, name } = await request.json<{ email: string; name?: string }>();

  if (!email) {
    return Response.json({ error: 'Email is required.' }, { status: 400 });
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${env.PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
      },
      body: JSON.stringify({
        email,
        first_name: name ?? '',
        reactivate_existing: false,
        send_welcome_email: true,
      }),
    }
  );

  if (!res.ok) {
    return Response.json({ error: 'Subscription failed. Please try again.' }, { status: 502 });
  }

  return Response.json({ success: true }, { status: 200 });
};
