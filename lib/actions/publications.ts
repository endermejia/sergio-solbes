"use server"

import { fetchItemDetails, fetchPublicacionesList } from "@/lib/scrapers/accedacris"

export async function getPublicationList() {
  return await fetchPublicacionesList();
}

export async function getPublicationDetails(handle: string) {
  return await fetchItemDetails(handle);
}
