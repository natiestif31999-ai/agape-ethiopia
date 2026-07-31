import { NextResponse } from "next/server";
import { getCurrentUser, getSupabaseServerClient, requireStaff } from "@/lib/auth/serverAuth";

export async function GET() {
  const profile = await requireStaff();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { data, error } = await supabase.from("donations").select("*").order("created_at", { ascending: false }).limit(100);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    donor_name,
    donor_email,
    donor_phone,
    amount,
    currency,
    country,
    payment_provider,
    transaction_reference,
    donation_purpose,
    donation_type,
    notes,
    status,
  } = body;

  const trimmedDonorName = donor_name?.toString().trim();
  const trimmedEmail = donor_email?.toString().trim();
  const numericAmount = Number(amount);

  if (!trimmedDonorName || !trimmedEmail || !Number.isFinite(numericAmount) || numericAmount <= 0) {
    return NextResponse.json({ error: "Missing required donation fields." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const currentUser = await getCurrentUser();
  const receiptNumber = `REC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { data, error } = await supabase
    .from("donations")
    .insert([
      {
        donor_id: currentUser?.id ?? null,
        donor_name: trimmedDonorName,
        donor_email: trimmedEmail,
        donor_phone: donor_phone?.toString().trim() ?? null,
        country: country?.toString().trim() || "Ethiopia",
        amount: numericAmount,
        currency: currency?.toString().trim() || "USD",
        payment_provider: payment_provider?.toString().trim() || "Stripe",
        transaction_reference: transaction_reference?.toString().trim() ?? null,
        donation_date: new Date().toISOString(),
        donation_purpose: donation_purpose?.toString().trim() || "General Fund",
        donation_type: donation_type?.toString().trim() || "one-time",
        receipt_number: receiptNumber,
        status: status?.toString().trim() || "pending",
        notes: notes?.toString().trim() ?? null,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { ...data, receipt_number: receiptNumber } });
}
