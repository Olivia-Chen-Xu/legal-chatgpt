"use client";
import React from "react";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChatContext } from "../../../../store/ChatContext";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { usePdfSearch } from "../../../../hooks/usePdfSearch";
import { DatasetSelection } from "../DatasetSelection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import "./SearchDocuments.css";
import { PineconeNamespaces } from "@/app/(private)/chat/enum/enums";

const SearchDocuments = () => {
  const {
    relevantDocs,
    documentQuery,
    namespace,
    pdfLoading,
  } = useChatContext();
  const { pdfSearch } = usePdfSearch();

  const formSchema = z.object({
    documentQuery: z.string().min(0, {
      message: "Query shouldn't be empty",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      documentQuery: documentQuery,
    },
  });

  const handleSearchDocuments = async (form: z.infer<typeof formSchema>) => {
    if (pdfLoading) return;
    pdfSearch(form.documentQuery, namespace);
  };

  return (
    <div
      id="search-documents"
      className="py-8 grid grid-rows-[auto_1fr] h-full gap-0 overflow-hidden"
    >
      <DatasetSelection />

      <div className="flex flex-col gap-3 overflow-hidden">
        <Accordion type="single" collapsible defaultValue="1">
          <AccordionItem value={"1"} className="border-b-0 overflow-hidden">
            <AccordionTrigger>
              <Label className="font-bold">Search Documents</Label>
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden flex flex-col gap-3 h-full">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSearchDocuments)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="documentQuery"
                    render={({ field }) => (
                      <FormItem>
                        {/* Document Query Input */}
                        <FormControl>
                          <Input
                            placeholder="What is employment Law?"
                            {...field}
                            value={documentQuery}
                            disabled={pdfLoading || namespace === PineconeNamespaces.no_dataset}
                            className="w-full bg-[#f8f8f8] text-left"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>

              {/* Document List Container */}
              <div
                className={cn(
                  `flex flex-col gap-3 w-full bg-transparent relative h-full overflow-auto pb-[50px]`
                )}
              >
                {/* List of Documents */}
                {pdfLoading && namespace !== PineconeNamespaces.no_dataset ? (
                  // Loading animation for relevant documents
                  <Label className="text-[grey] flex items-center gap-3 justify-center h-full flex-col text-nowrap">
                    Finding Relevant Documents
                    <LoadingSpinner />
                  </Label>
                ) : relevantDocs && relevantDocs.length > 0 ? (
                  relevantDocs.map((doc: any, i: number) => (
                    <Card key={i} className="bg-[#f8f8f8]">
                      <a
                        href={doc.url}
                        target="_blank"
                        className="cursor-pointer"
                      >
                        <CardHeader className="pt-4 pb-2 px-6">
                          <CardTitle className="font-bold text-md truncate">
                            {doc.fileName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                          <div className="flex flex-col">
                            <Label className="font-normal">URL:</Label>
                            <output className="text-[#0000EE] truncate text-xs">
                              {doc.url}
                            </output>
                          </div>
                          <div className="flex flex-col">
                            <Label className="font-normal">Abstract</Label>
                            <output className="max-h-[200px] text-ellipsis line-clamp-6 text-xs">
                              {doc.content}
                            </output>
                          </div>
                        </CardContent>
                      </a>
                    </Card>
                  ))
                ) : (
                  // No documents available
                  <Label className="text-[grey] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-nowrap">
                    No Documents Available.
                  </Label>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default SearchDocuments;
