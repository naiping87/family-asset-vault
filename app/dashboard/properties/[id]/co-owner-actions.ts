"use server";

import { addCoOwner, removeCoOwner } from "@/lib/api/co-owners";
import { revalidatePath } from "next/cache";

export async function addCoOwnerAction(propertyId: string, formData: FormData) {
  formData.set("property_id", propertyId);
  await addCoOwner(formData);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function removeCoOwnerAction(propertyId: string, coOwnerId: string) {
  await removeCoOwner(coOwnerId);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}
