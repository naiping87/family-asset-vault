"use server";

import { deleteProperty } from "@/lib/api/properties";
import { redirect } from "next/navigation";

export async function deletePropertyAction(propertyId: string) {
  const result = await deleteProperty(propertyId);
  if (result.error) return { error: result.error };
  redirect("/dashboard/properties");
}
