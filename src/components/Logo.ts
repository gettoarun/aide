export default class Logo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div style="font-size: 2rem; padding: 5px; width: 40px; margin: 5px; text-align: center;">&#230;</div>
        `
    }
}

customElements.define("aide-logo", Logo);