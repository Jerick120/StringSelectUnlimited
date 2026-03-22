import { StringSelectMenuBuilder, type SelectMenuComponentOptionData } from "discord.js";
import type { APISelectMenuOption } from 'discord-api-types/v10';
import type { PageData } from "./typings/PageData.js";
import type { StringSelectUnlimitedOptions } from "./typings/StringSelectUnlimitedOptions.js";
export declare class StringSelectUnlimited extends StringSelectMenuBuilder {
    private menuOptions;
    private page;
    private pageData;
    private totalPages;
    private totalItems;
    private placeholder;
    private menuLimit;
    /**
     * @param page Initial page number
     * @param totalItems Total number of items
     * @param pageMetadata Metadata to stringify along with page option
     */
    constructor({ page, totalItems, pageMetadata, }: StringSelectUnlimitedOptions);
    private parsePagination;
    private parsePageData;
    private getPage;
    setOptions(options: SelectMenuComponentOptionData[]): this;
    addOptions(options: SelectMenuComponentOptionData[]): this;
    spliceOptions(index: number, deleteCount: number, options: APISelectMenuOption[]): this;
    setPlaceholder(placeholder: string): this;
    setTotalItems(total: number): this;
    setPageMetadata(metadata: PageData): this;
    goto(page: number): this;
    get pageMetadata(): PageData | null;
    get pageSize(): number;
    get currentPageNumber(): number;
    get totalPageNumber(): number;
    get nextPageNumber(): number | null;
    get prevPageNumber(): number | null;
}
//# sourceMappingURL=StringSelectUnlimited.d.ts.map