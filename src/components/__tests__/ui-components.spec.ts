import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { mount } from "@vue/test-utils"
import { plugin as langPlugin, useLang } from "regira_modules/vue/lang"
import { Icon, IconButton, DescriptionInput, ResultSummary, useFeedback } from "regira_modules/vue/ui"
import FormButtonsRow from "../input/FormButtonsRow.vue"

// subset of public/data/translations.json — the keys FormButtonsRow renders
const messages = {
    save: { en: "Save", nl: "Opslaan" },
    reset: { en: "Reset", nl: "Opnieuw" },
    delete: { en: "Delete", nl: "Verwijder" },
    restore: { en: "Restore", nl: "Herstel" },
    "removeItem?": { en: "Remove item?", nl: "Item verwijderen?" },
    deleteItem: { en: "Delete item '{title}'?", nl: "Verwijder '{title}'?" },
    description: { en: "Description", nl: "Beschrijving" },
}

const globalConfig = {
    plugins: [[langPlugin, { defaultLang: "en", messages }] as never],
    components: { Icon, IconButton },
}

describe("FormButtonsRow (local i18n variant)", () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="modals"></div>'
    })
    afterEach(() => {
        useLang().setLangCode("en")
    })

    const mountRow = (props: Record<string, unknown> = {}) =>
        mount(FormButtonsRow, {
            props: { feedback: useFeedback(), ...props },
            global: globalConfig,
            attachTo: document.body,
        })

    it("renders save / reset / delete buttons with translated labels", () => {
        const wrapper = mountRow({ item: { id: 1, $title: "Item X" } })
        const text = wrapper.text()
        expect(text).toContain("Save")
        expect(text).toContain("Reset")
        expect(text).toContain("Delete")
        expect(wrapper.find("button[type=submit]").attributes("disabled")).toBeUndefined()
    })

    it("translates labels when the language changes", async () => {
        const wrapper = mountRow({ item: { id: 1, $title: "Item X" } })
        useLang().setLangCode("nl")
        await wrapper.vm.$nextTick()
        const text = wrapper.text()
        expect(text).toContain("Opslaan")
        expect(text).toContain("Opnieuw")
        expect(text).toContain("Verwijder")
    })

    it("disables save while feedback is pending", async () => {
        const feedback = useFeedback()
        const wrapper = mountRow({ feedback })
        feedback.pending("saving...")
        await wrapper.vm.$nextTick()
        expect(wrapper.find("button[type=submit]").attributes("disabled")).toBeDefined()
    })

    it("shows only Restore for an archived item (numeric flag)", () => {
        const wrapper = mountRow({ item: { id: 1, $title: "Item X", isArchived: 1 } })
        expect(wrapper.text()).toContain("Restore")
        expect(wrapper.find("button[type=submit]").exists()).toBe(false)
        expect(wrapper.find(".btn-danger").exists()).toBe(false)
    })

    it("hides the delete button when showDelete is false", () => {
        const wrapper = mountRow({ showDelete: false })
        expect(wrapper.find(".btn-danger").exists()).toBe(false)
    })

    it("opens the delete confirmation with translated title and item title", async () => {
        const wrapper = mountRow({ item: { id: 1, $title: "Item X" } })
        useLang().setLangCode("nl")
        await wrapper.vm.$nextTick()
        await wrapper.find(".btn-danger").trigger("click")
        const modal = document.querySelector("#modals")
        expect(modal?.textContent).toContain("Item verwijderen?")
        expect(modal?.textContent).toContain("Verwijder 'Item X'?")
    })

    it("emits cancel / restore", async () => {
        const wrapper = mountRow({ item: { id: 1, $title: "Item X" } })
        await wrapper.find("button.btn-secondary").trigger("click")
        expect(wrapper.emitted("cancel")).toHaveLength(1)

        const archived = mountRow({ item: { id: 1, $title: "Item X", isArchived: true } })
        await archived.find("button.btn-warning").trigger("click")
        expect(archived.emitted("restore")).toHaveLength(1)
    })
})

describe("DescriptionInput (library)", () => {
    it("renders a labeled textarea and updates the model", async () => {
        const wrapper = mount(DescriptionInput, {
            props: { modelValue: "hello", label: "Beschrijving" },
        })
        const textarea = wrapper.find("textarea")
        expect((textarea.element as HTMLTextAreaElement).value).toBe("hello")
        expect(wrapper.text()).toContain("Beschrijving")
        await textarea.setValue("world")
        const updates = wrapper.emitted("update:modelValue")!
        expect(updates[updates.length - 1]).toEqual(["world"])
    })
})

describe("ResultSummary (library)", () => {
    it("renders visible / total", () => {
        const wrapper = mount(ResultSummary, { props: { visibleCount: 12, totalCount: 340 } })
        expect(wrapper.text().replace(/\s+/g, " ")).toBe("12 / 340")
    })
})
