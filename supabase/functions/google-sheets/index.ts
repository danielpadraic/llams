import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { google } from "npm:googleapis";

// Helper function to set CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Validate the request method
    if (req.method !== "POST") {
      throw new Error("Method not allowed: only POST is supported");
    }

    // Validate the Content-Type header
    const contentType = req.headers.get("Content-Type");
    if (!contentType?.includes("application/json")) {
      throw new Error("Content-Type must be application/json");
    }

    // Read the raw body as text to debug
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse the body as JSON
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (error) {
      throw new Error(`Failed to parse JSON body: ${error.message}`);
    }

    if (!payload || !payload.record) {
      throw new Error("Missing 'record' in request body");
    }

    const lead = payload.record;

    // Log the incoming lead for debugging
    console.log("Parsed lead:", JSON.stringify(lead, null, 2));

    // Validate environment variables
    // Validate environment variables
const credentialsEnv = Deno.env.get("GOOGLE_SHEETS_CREDENTIALS");
console.log("GOOGLE_SHEETS_CREDENTIALS value:", credentialsEnv ? "Set (hidden for security)" : "Not set");
const spreadsheetId = Deno.env.get("GOOGLE_SHEET_ID");
console.log("GOOGLE_SHEET_ID value:", spreadsheetId ? "Set (hidden for security)" : "Not set");

if (!credentialsEnv) {
  throw new Error("Missing GOOGLE_SHEETS_CREDENTIALS environment variable");
}
if (!spreadsheetId) {
  throw new Error("Missing GOOGLE_SHEET_ID environment variable");
}

    let credentials;
    try {
      credentials = JSON.parse(credentialsEnv);
    } catch (error) {
      throw new Error(
        `Invalid GOOGLE_SHEETS_CREDENTIALS format: ${error.message}`
      );
    }

    // Initialize Google Sheets API
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ["https://www.googleapis.com/auth/spreadsheets"]
    );

    const sheets = google.sheets({ version: "v4", auth });

    // Prepare the data for Google Sheets, converting null/undefined to empty strings
    const values = [
      [
        lead.id ?? "",
        lead.created_at ?? "",
        lead.type ?? "",
        lead.first_name ?? "",
        lead.last_name ?? "",
        lead.phone ?? "",
        lead.email ?? "",
        lead.city_state_zip ?? "",
        lead.looking_for ?? "",
        lead.budget ?? "",
        lead.comments ?? "",
        lead.preferred_contact ?? "",
        lead.move_in_time ?? "",
        lead.move_in_comments ?? "",
        lead.travel_time ?? "",
        lead.travel_comments ?? "",
        lead.rv_use ?? "",
        lead.unit_count ?? "",
        lead.rental_start_time ?? "",
        lead.rental_start_comments ?? "",
        lead.has_land ?? "",
        lead.needs_land_help ?? "",
        lead.purchase_method ?? "",
      ],
    ];

    // Append the data to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: "Sheet1!A1",
      valueInputOption: "RAW",
      resource: { values },
    });

    // Log the Google Sheets API response for debugging
    console.log(
      "Google Sheets API response:",
      JSON.stringify(response, null, 2)
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error in google-sheets:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});