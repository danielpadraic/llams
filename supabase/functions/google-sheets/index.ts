import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { google } from "npm:googleapis";

serve(async (req) => {
  try {
    const payload = await req.json();
    const lead = payload.record;

    // Initialize Google Sheets API
    const credentials = JSON.parse(Deno.env.get("GOOGLE_SHEETS_CREDENTIALS"));
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the data for Google Sheets
    const values = [
      [
        lead.id,
        lead.created_at,
        lead.type,
        lead.first_name,
        lead.last_name,
        lead.phone,
        lead.email,
        lead.city_state_zip,
        lead.looking_for,
        lead.budget,
        lead.comments,
        lead.preferred_contact,
        lead.move_in_time || "",
        lead.move_in_comments || "",
        lead.travel_time || "",
        lead.travel_comments || "",
        lead.rv_use || "",
        lead.unit_count || "",
        lead.rental_start_time || "",
        lead.rental_start_comments || "",
        lead.has_land || "",
        lead.needs_land_help || "",
        lead.purchase_method || "",
      ],
    ];

    // Append the data to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: Deno.env.get("GOOGLE_SHEET_ID"),
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      resource: { values },
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});