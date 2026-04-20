import {
    StringSelectMenuBuilder,
    type SelectMenuComponentOptionData,
} from "discord.js";
import type {PageData} from "./typings/PageData.js";
import type {StringSelectUnlimitedOptions} from "./typings/StringSelectUnlimitedOptions.js";

const MAX_MENU_ITEMS = 25;

export class StringSelectUnlimited extends StringSelectMenuBuilder {
    /**
     * All select menu options.
     * @private
     */
    private menuOptions: SelectMenuComponentOptionData[] = [];
    /**
     * Additional data to add to the page option.
     * @private
     */
    private pageData: PageData;
    /**
     * Current page number starting from 1.
     * @private
     */
    private page = 1;
    /**
     * Total number of pages.
     * @private
     */
    private totalPages = 0;
    /**
     * Total number of items.
     * This is automatically inferred unless manually specified.
     * @private
     */
    private totalItems: number = 0;
    /**
     * Flag to check if totalItems were manually specified.
     * Disables automatic length checking.
     * @private
     */
    private isManualTotal: boolean = false;
    /**
     * Default placeholder.
     * If pagination exists, `- Page {number}` is appended to the end of this string.
     * @private
     */
    private placeholder = 'Make a selection';
    /**
     * Max menu limit.
     * If pagination exists, this is set to menuLimit - 2 to make room for page options.
     * @private
     */
    private menuLimit = MAX_MENU_ITEMS;

    /**
     * @param page Initial page number
     * @param totalItems Total number of items
     * @param pageMetadata Metadata to stringify along with page option
     */

    constructor({
                    page,
                    totalItems,
                    pageMetadata,
                }: StringSelectUnlimitedOptions) {
        super();

        this.pageData = pageMetadata ? {...pageMetadata} : {emoji: {}, data: {}};

        if (page !== undefined) this.setPageNumber(page);
        if (totalItems !== undefined) this.setTotalItems(totalItems);
    }

    private parsePagination() {
        this.menuLimit = this.totalItems >= MAX_MENU_ITEMS ? MAX_MENU_ITEMS - 2 : MAX_MENU_ITEMS;
        this.totalPages = Math.ceil(this.totalItems / this.menuLimit);
    }

    private parsePageData(pageNumber: number | null): string {
        return JSON.stringify({
            goto: pageNumber || 0,
            ...this.pageData.data,
        });
    }

    private getPage(): SelectMenuComponentOptionData[] {
        if (!this.menuOptions.length) return []
        const isFullDataset = this.menuOptions.length === this.totalItems
        const start = isFullDataset ? this.menuLimit * (this.page - 1) : 0;
        const offset = isFullDataset ? this.menuLimit * this.page : this.menuLimit;
        const pageData = this.menuOptions.slice(start, offset);

        if (this.totalPages > 1) {
            const emojiNext = this.pageData.emoji?.next || '';
            const emojiPrev = this.pageData.emoji?.previous || '';
            if (this.page === 1 && this.totalPages > 2)
                pageData.unshift({
                    label: "Last →→",
                    description: `Page ${this.totalPageNumber}`,
                    emoji: emojiNext,
                    value: this.parsePageData(this.totalPages),
                });
            if (this.page > 1)
                pageData.unshift({
                    label: "← Previous",
                    description: `Page ${this.prevPageNumber}`,
                    emoji: emojiPrev,
                    value: this.parsePageData(this.prevPageNumber),
                });

            if (this.page === this.totalPages && this.totalPages > 2)
                pageData.push({
                    label: "←← First",
                    description: `Page 1`,
                    emoji: emojiPrev,
                    value: this.parsePageData(1),
                });

            if (this.page < this.totalPages)
                pageData.push({
                    label: "Next →",
                    description: `Page ${this.nextPageNumber}`,
                    emoji: emojiNext,
                    value: this.parsePageData(this.nextPageNumber),
                });
        }
        return pageData;
    }

    override setOptions(options: SelectMenuComponentOptionData[]): this {
        this.menuOptions = options;

        if (!this.isManualTotal) this.totalItems = this.menuOptions.length

        this.setPlaceholder();

        return super.setOptions(this.getPage());
    }

    override addOptions(options: SelectMenuComponentOptionData[]): this {
        this.menuOptions.push(...options);

        if (!this.isManualTotal) this.totalItems = this.menuOptions.length

        this.setPlaceholder();

        return super.setOptions(this.getPage());
    }

    override setPlaceholder(placeholder?: string): this {
        this.parsePagination()
        this.placeholder = placeholder || this.placeholder
        const placeholderParsed = `${this.placeholder}${this.totalPages > 1 ? ` - Page ${this.page}` : ""}`;

        return super.setPlaceholder(placeholderParsed);
    }

    public setTotalItems(total: number): this {
        if (total <= 0) throw new Error('Total must be >= 1.')
        this.totalItems = total;
        this.isManualTotal = true;

        this.setPlaceholder()

        return this;
    }

    public setPageNumber(page: number): this {
        /**
         * This force sets the page number without loading the page data.
         * Can be useful if the same instance is used for different datasets.
         * goto() can be used if page data needs to be loaded.
         * */
        if (!Number.isFinite(page)) throw new Error('Invalid page number')
        if (page <= 0) throw new Error('Page cannot be <= 0.')
        this.page = page
        return this;
    }

    public setPageMetadata(metadata: PageData): this {
        this.pageData.data = {...this.pageData.data, ...(metadata.data || {})}
        this.pageData.emoji = {...this.pageData.emoji, ...(metadata.emoji || {})}

        return super.setOptions(this.getPage());
    }

    public goto(page: number): this {
        if (!this.menuOptions.length) throw new Error(`No options added`);
        if (!Number.isFinite(page)) throw new Error('Invalid page number')
        if (page <= 0 || page > this.totalPages)
            throw new Error(`Page must be between 1 and ${this.totalPages}`);
        this.page = page;

        this.setPlaceholder()

        return super.setOptions(this.getPage())
    }

    get pageMetadata(): PageData | null {
        return this.pageData;
    }

    get pageSize(): number {
        return this.menuLimit
    }

    get currentPageNumber(): number {
        return this.page;
    }

    get totalPageNumber(): number {
        return this.totalPages;
    }

    get nextPageNumber(): number | null {
        const next = this.page + 1;
        if (next > this.totalPages) return null;
        return next;
    }

    get prevPageNumber(): number | null {
        const prev = this.page - 1;
        if (prev <= 0) return null;
        return prev;
    }
}
