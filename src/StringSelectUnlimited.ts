import {
    StringSelectMenuBuilder,
    type SelectMenuComponentOptionData,
} from "discord.js";
import type {PageData} from "./typings/PageData.js";
import type {StringSelectUnlimitedOptions} from "./typings/StringSelectUnlimitedOptions.js";

const MAX_MENU_ITEMS = 25;

export class StringSelectUnlimited extends StringSelectMenuBuilder {
    // All select menu options
    private menuOptions: SelectMenuComponentOptionData[] = [];

    private page: number; // 1 based
    // Additional data to add to the page option
    private pageData: PageData;

    private totalPages = 0;
    private totalItems: number;
    private isTotalManual: boolean = false;

    private placeholder = 'Make a selection';

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

        this.page = page || 1;
        if (this.page <= 0) throw new Error("Page must start from 1");

        this.pageData = pageMetadata || {emoji: {}, data: {}};
        this.totalItems = totalItems || 0;
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
        const start = this.menuOptions.length === this.totalItems ? this.menuLimit * (this.page - 1) : 0;
        const offset = this.menuOptions.length === this.totalItems ? this.menuLimit * this.page : this.menuLimit;
        const pageData = this.menuOptions.slice(start, offset);

        if (this.totalPages > 1) {
            const emojiNext = this.pageData.emoji?.next;
            const emojiPrev = this.pageData.emoji?.previous;
            if (this.page === 1 && this.totalPages > 2)
                pageData.unshift({
                    label: "Last →→",
                    description: `Page ${this.totalPageNumber}`,
                    emoji: emojiNext,
                    value: this.parsePageData(this.totalPages),
                } as SelectMenuComponentOptionData);

            if (this.page > 1)
                pageData.unshift({
                    label: "← Previous",
                    description: `Page ${this.prevPageNumber}`,
                    emoji: emojiPrev,
                    value: this.parsePageData(this.prevPageNumber),
                } as SelectMenuComponentOptionData);

            if (this.page === this.totalPages && this.totalPages > 2)
                pageData.push({
                    label: "←← First",
                    description: `Page 1`,
                    emoji: emojiPrev,
                    value: this.parsePageData(1),
                } as SelectMenuComponentOptionData);

            if (this.page < this.totalPages)
                pageData.push({
                    label: "Next →",
                    description: `Page ${this.nextPageNumber}`,
                    emoji: emojiNext,
                    value: this.parsePageData(this.nextPageNumber),
                } as SelectMenuComponentOptionData);
        }
        return pageData;
    }

    override setOptions(options: SelectMenuComponentOptionData[]): this {
        this.menuOptions = options;
        if (this.isTotalManual) {
            if (options.length > this.totalItems) {
                throw new Error('Option length cannot exceed the manually set total.')
            }
        } else {
            this.totalItems = options.length;
            this.page = 1;
        }

        this.setPlaceholder();

        return super.setOptions(this.getPage());
    }

    override addOptions(options: SelectMenuComponentOptionData[]): this {
        if (this.isTotalManual) throw new Error('Cannot use addOptions after manually setting the total. Use setOptions instead.')
        this.menuOptions.push(...options);
        this.totalItems += options.length

        this.setPlaceholder();

        return super.setOptions(this.getPage());
    }

    override setPlaceholder(placeholder?: string): this {
        this.parsePagination()
        this.placeholder = placeholder || this.placeholder
        const placeholderParsed = `${this.placeholder}${this.totalItems >= MAX_MENU_ITEMS ? ` - Page ${this.page}` : ""}`;

        return super.setPlaceholder(placeholderParsed);
    }

    public setTotalItems(total: number): this {
        if (total < this.menuOptions.length)
            throw new Error("Total cannot be less than the number of items.");
        if (this.menuOptions.length > this.menuLimit)
            throw new Error("Total cannot be set manually with accumulated options.");

        this.totalItems = total;
        this.isTotalManual = true;

        this.setPlaceholder()

        return this;
    }

    public setPageMetadata(metadata: PageData): this {
        if (this.pageData) {
            this.pageData.data = {...this.pageData.data, ...(metadata.data || {})}
            this.pageData.emoji = {...this.pageData.emoji, ...(metadata.emoji || {})}
        } else this.pageData = metadata

        return super.setOptions(this.getPage());
    }

    public goto(page: number): this {
        if (!this.menuOptions.length) throw new Error(`No options added`);
        if (page <= 0 || page > this.totalPages)
            throw new Error(`Page must be between 1 and ${this.totalPages}`);
        this.page = page;
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
