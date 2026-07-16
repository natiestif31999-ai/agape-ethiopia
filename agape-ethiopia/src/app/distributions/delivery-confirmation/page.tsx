import DeliveryConfirmationForm from "@/components/DeliveryConfirmationForm";

export const metadata = {
  title: "Delivery Confirmation",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <DeliveryConfirmationForm />
    </main>
  );
}
