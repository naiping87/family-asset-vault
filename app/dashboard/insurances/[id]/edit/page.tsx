import { InsuranceForm } from "@/components/features/InsuranceForm";
import { getInsurance } from "@/lib/api/insurances";
import { getProperties } from "@/lib/api/properties";
import { notFound } from "next/navigation";

export default async function EditInsurancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const insurance = await getInsurance(id);
  if (!insurance) notFound();

  const properties = await getProperties();
  const propOptions = properties.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }));

  return <InsuranceForm properties={propOptions} insurance={insurance} />;
}
