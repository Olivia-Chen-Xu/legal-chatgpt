import React from "react";
// import "./App.css";
import Chat from "../Chat";
import Search from "../Search";
import AppSearchAPIConnector from "@elastic/search-ui-app-search-connector";
import { SearchProvider, WithSearch } from "@elastic/react-search-ui";

const connector = new AppSearchAPIConnector({
    searchKey: process.env.REACT_APP_PUBLIC_SEARCH_KEY,
    engineName: "open-justice-meta",
    endpointBase: process.env.REACT_APP_ENDPOINT_URL,
});

const config = {
    alwaysSearchOnInitialLoad: false,
    apiConnector: connector,
    hasA11yNotifications: true,
    searchQuery: {
        filters: [],
        result_fields: {
            title: {
                snippet: {
                    fallback: true,
                    size: 100,
                },
            },
            source: { raw: {} },
            abstract: {
                snippet: {
                    fallback: true,
                    size: 500,
                },
            },
            body: {
                snippet: {
                    fallback: true,
                },
            },
            url: { raw: {} },
        },
        search_fields: { title: {} },
        disjunctiveFacets: ["source"],
        facets: { source: { type: "value", size: 30 } },
    },
};

function ChatPage() {
    return (
        <SearchProvider config={config}>
            <WithSearch
                mapContextToProps={({ wasSearched, setSearchTerm }) => ({
                    wasSearched,
                    setSearchTerm,
                })}
            >
                {({ wasSearched, setSearchTerm }) => {
                    return (
                        <div className="App">
                            <div
                                style={{
                                    width: "30%",
                                    height: "%100%",
                                    overflow: "scroll",
                                }}
                            >
                                <Search
                                    wasSearched={wasSearched}
                                    setSearchTerm={setSearchTerm}
                                ></Search>
                            </div>
                            <div
                                style={{
                                    width: "70%",
                                    height: "100%",
                                    overflow: "scroll",
                                    justifyContent: "center",
                                }}
                            >
                                <Chat
                                    setSearchTerm={setSearchTerm}
                                ></Chat>
                            </div>
                        </div>
                    );
                }}
            </WithSearch>
        </SearchProvider>
    );
}

export default ChatPage;
