"use server"

import { fetchItemDetails } from "@/lib/scrapers/accedacris"

export async function getPublicationDetails(handle: string) {
  return await fetchItemDetails(handle);
}
