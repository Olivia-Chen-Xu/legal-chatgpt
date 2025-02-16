export enum DocumentQueryOptions {
  keywordSearchLabel = "Keyword Document Search",
  keywordSearchValue = "keyword-search",
  semanticSearchLabel = "Semantic Document Search",
  semanticSearchValue = "semantic-search",
  globalSearchLabel = "Global Semantic Document Search",
  globalSearchValue = "global-search",
}

export enum PineconeIndexes {
  staticDocuments = "legal-pdf-documents",
  dynamicDocuments = "global-search",
}

// ALFA TEAM

export enum PineconeNamespaces {
  no_dataset = "no_dataset",
  canadian_law = "canadian_law",
  unitedStates_law = "usa_law",
  french_law = "french_law",
  australian_law = "australian_law",
  without_cause_termination = "without_cause_termination",
  reasonable_notice_termination = "reasonable_notice_termination",
  minimum_standards_termination = "minimum_standards_termination",
  
  constructive_dismissal = "constructive_dismissal",
  factors_affecting_notice = "factors_affecting_notice",
  just_cause_dismissal = "just_cause_dismissal",
  procedure_on_dismissal = "procedure_on_dismissal",
}

export enum ChatPanelOptions {
  searchDocuments = "Search Documents",
  uploadDocuments = "Upload Documents",
  dataFilters = "Data Filters",
}
