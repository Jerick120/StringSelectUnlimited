import { StringSelectMenuBuilder, } from "discord.js";
const MAX_MENU_ITEMS = 25;
export class StringSelectUnlimited extends StringSelectMenuBuilder {
    // All select menu options
    menuOptions = [];
    page; // 1 based
    // Additional data to add to the page option
    pageData;
    totalPages = 0;
    totalItems;
    placeholder = '';
    menuLimit = MAX_MENU_ITEMS;
    /**
     * @param page Initial page number
     * @param totalItems Total number of items
     * @param pageMetadata Metadata to stringify along with page option
     */
    constructor({ page, totalItems, pageMetadata, }) {
        super();
        this.page = page || 1;
        if (this.page <= 0)
            throw new Error("Page must start from 1");
        this.pageData = pageMetadata || { emoji: {}, data: {} };
        this.totalItems = totalItems || 0;
    }
    parsePagination() {
        this.menuLimit = this.totalItems >= MAX_MENU_ITEMS ? MAX_MENU_ITEMS - 2 : MAX_MENU_ITEMS;
        this.totalPages = Math.ceil(this.totalItems / this.menuLimit);
    }
    parsePageData(pageNumber) {
        return JSON.stringify({
            page: this.page,
            goto: pageNumber || 0,
            ...this.pageData.data,
        });
    }
    getPage() {
        if (!this.menuOptions.length)
            return [];
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
    setOptions(options) {
        this.menuOptions = options;
        this.totalItems ||= options.length;
        this.setPlaceholder(this.placeholder);
        return super.setOptions(this.getPage());
    }
    addOptions(options) {
        this.menuOptions.push(...options);
        this.totalItems += options.length;
        this.setPlaceholder(this.placeholder);
        return super.setOptions(this.getPage());
    }
    spliceOptions(index, deleteCount, options) {
        const deleted = this.menuOptions.splice(index, deleteCount, ...options);
        this.totalItems = this.totalItems + (options.length - deleted.length);
        this.setPlaceholder(this.placeholder);
        return super.setOptions(this.getPage());
    }
    setPlaceholder(placeholder) {
        this.parsePagination();
        this.placeholder ||= placeholder;
        if (placeholder) {
            const placeholderParsed = `${placeholder}${this.totalItems >= MAX_MENU_ITEMS ? ` - Page ${this.page}` : ""}`;
            return super.setPlaceholder(placeholderParsed);
        }
        return this;
    }
    setTotalItems(total) {
        if (total < this.menuOptions.length)
            throw new Error("Total cannot be less than the number of items.");
        this.totalItems = total;
        this.setPlaceholder(this.placeholder);
        return this;
    }
    setPageMetadata(metadata) {
        if (this.pageData) {
            this.pageData.data = { ...this.pageData.data, ...(metadata.data || {}) };
            this.pageData.emoji = { ...this.pageData.emoji, ...(metadata.emoji || {}) };
        }
        else
            this.pageData = metadata;
        return super.setOptions(this.getPage());
    }
    goto(page) {
        if (!this.menuOptions.length)
            throw new Error(`No options added`);
        if (page <= 0 || page > this.totalPages)
            throw new Error(`Page must be between 1 and ${this.totalPages}`);
        this.page = page;
        return super.setOptions(this.getPage());
    }
    get pageMetadata() {
        return this.pageData;
    }
    get pageSize() {
        return this.menuLimit;
    }
    get currentPageNumber() {
        return this.page;
    }
    get totalPageNumber() {
        return this.totalPages;
    }
    get nextPageNumber() {
        const next = this.page + 1;
        if (next > this.totalPages)
            return null;
        return next;
    }
    get prevPageNumber() {
        const prev = this.page - 1;
        if (prev <= 0)
            return null;
        return prev;
    }
}
//# sourceMappingURL=StringSelectUnlimited.js.map