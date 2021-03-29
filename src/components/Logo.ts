export default class Logo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<h3 style="margin: 4px; font-weight: italic;">A.I.D.E</h3>`
    }
}

customElements.define("aide-logo", Logo);