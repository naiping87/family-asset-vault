import { InsuranceForm } from "@/components/features/InsuranceForm";
import { getProperties } from "@/lib/api/properties";

export default async function NewInsurancePage() {
  const properties = await getProperties();
  const propOptions = properties.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name }));
  return <InsuranceForm properties={propOptions} />;
}
