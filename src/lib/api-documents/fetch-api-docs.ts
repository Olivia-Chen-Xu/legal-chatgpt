/**
 * @file: fetch-api-docs - utility funtion that helps fetch the relevant documents from CourtListener and Canlii
 *
 * @author Kevin Yu <yu.kevin2002@gmail.com>
 * @date Jul 2024
 */

import { PineconeNamespaces } from "@/app/(private)/chat/enum/enums";
import { RelevantDocument } from "@/app/features/chat/models/types";

/**
 * Fetches documents from Court Listener and Canlii
 * 
 * @param searchTerm 
 * @param namespace 
 * @returns 
 */
export const fetchAPIDocs = async (searchTerm: string, namespace: string) => {
  const results: any[] = [];

  switch (namespace) {
    case PineconeNamespaces.unitedStates_law:
      await fetchUSDocs(searchTerm, results);
      break;
    case PineconeNamespaces.canadian_law:
      await fetchCanadianDocs(searchTerm, results);
      break;
    default:
      console.log("No valid api to call to fetch documents");
  }

  return results;
};

async function fetchUSDocs(searchTerm: string, results: RelevantDocument[]) {
  /**
   * What is Court Listener?
   * TLDR: CourtListener is a free legal research website containing millions of legal opinions from federal and state courts.
   * Reference: https://www.courtlistener.com/help/api/rest/#search-endpoint
   */

  const urlCourtListener = `https://www.courtlistener.com/api/rest/v3/search/?q=${searchTerm}`;

  const resCourtListener = await fetch(urlCourtListener);

  // Call Court Listener for US case-law documents
  try {
    const courtListenerJson = await resCourtListener.json();

    if (!courtListenerJson.results)
      throw new Error("Failed to get US case law documents");

    for (const res of courtListenerJson.results) {
      results.push({
        url: "https://www.courtlistener.com" + res.absolute_url,
        content: res.snippet,
        fileName: res.caseName,
      });
    }
  } catch (e) {
    console.error(e);
  }
}

async function fetchCanadianDocs(
  searchTerm: string,
  results: RelevantDocument[]
) {
  /**
   * What is Google Search API?
   * TLDR: this API, you can use RESTful requests to get search results in JSON format.
   * Reference: https://developers.google.com/custom-search/docs/overview
   *
   * cx => Search Engine ID
   * key => Google search Key
   * The siterestrict part is a resource path within the Google Custom Search JSON API. When you use siterestrict, it restricts the search results to the specified site collection defined by your custom search engine ID (cx parameter).
   */
  const urlGoogleSearch = `https://www.googleapis.com/customsearch/v1/siterestrict?cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ID}&q=${searchTerm}&key=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_KEY}`;


  // Call Google Search API for Canadian case-law documents
  try {
    const googleJson = await resGoogleSearch.json();

    if (!googleJson.items)
      throw new Error("Failed to get Canadian case law documents");

    // for (const res of googleJson.items) {
    //   results.push({
    //     url: res.link,
    //     content: res.snippet,
    //     fileName: res.title,
    //   });
    // }
  } catch (e) {
    console.error(e);
  }
}
