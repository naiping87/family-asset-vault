import { PropertyForm } from "@/components/features/PropertyForm";
import { DeletePropertyButton } from "@/components/features/DeletePropertyButton";
import { getProperty } from "@/lib/api/properties";
import { notFound } from "next/navigation";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  return (
    <>
      <PropertyForm property={property} mode="edit" />
      <div style={{ marginTop: 24 }}>
        <DeletePropertyButton propertyId={id} />
      </div>
    </>
  );
}
