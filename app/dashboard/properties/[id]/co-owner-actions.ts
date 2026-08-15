"use server";

import { addCoOwner, updateCoOwner, removeCoOwner } from "@/lib/api/co-owners";
import { revalidatePath } from "next/cache";

export async function addCoOwnerAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  const result = await addCoOwner(formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function editCoOwnerAction(propertyId: string, coOwnerId: string, formData: FormData) {
  const result = await updateCoOwner(coOwnerId, formData);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function removeCoOwnerAction(propertyId: string, coOwnerId: string) {
  const result = await removeCoOwner(coOwnerId);
  if (result.error) return { error: result.error };
  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}
