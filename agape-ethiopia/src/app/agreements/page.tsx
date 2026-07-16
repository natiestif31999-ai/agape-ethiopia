import OrganizationAgreements from "@/components/OrganizationAgreements";

export const metadata = {
  title: "Organization Agreements",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <OrganizationAgreements />
    </main>
  );
}
