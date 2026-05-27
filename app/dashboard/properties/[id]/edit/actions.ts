"use server";

import { updateProperty } from "@/lib/api/properties";
import { redirect } from "next/navigation";

export async function updatePropertyAction(propertyId: string, _prevState: unknown, formData: FormData) {
  const result = await updateProperty(propertyId, formData);
  if (result.error) return { error: result.error };
  redirect("/dashboard/properties/" + propertyId);
}
