"use server"

import { fetchItemDetails, fetchPublicacionesList, fetchProyectosList } from "@/lib/scrapers/accedacris"

export async function getPublicationList() {
  return await fetchPublicacionesList();
}

export async function getPublicationDetails(handle: string) {
  return await fetchItemDetails(handle);
}

export async function getProjectsList() {
  return await fetchProyectosList();
}
