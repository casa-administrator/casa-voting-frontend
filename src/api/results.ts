import {
  apiDownload,
  apiRequest,
} from "./client";

import type {
  ElectionResult,
} from "../types/results";


export function getPublicResults(
  electionId:
    string,
) {
  return apiRequest<ElectionResult>(
    `/public/elections/${electionId}/results`,
  );
}


export function getAdminResults(
  electionId:
    string,
) {
  return apiRequest<ElectionResult>(
    `/admin/elections/${electionId}/results`,
  );
}


export async function exportElectionResultsExcel(
  electionId: string,
  language: "en" | "km",
) {
  return apiDownload(
    `/admin/elections/${electionId}/results/export.xlsx?lang=${language}`,
  );
}


export async function exportElectionResultsPdf(
  electionId: string,
  language: "en" | "km",
) {
  return apiDownload(
    `/admin/elections/${electionId}/results/export.pdf?lang=${language}`,
  );
}


export async function exportRawVotesJson(
  electionId: string,
) {
  return apiDownload(
    `/admin/elections/${electionId}/votes/export.json`,
  );
}