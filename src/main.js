import './publicApis'
import { htmlFiles } from './elements';

for (const filePath of htmlFiles) {
    const fileName = filePath.split("/").pop();
    const dashSplit = fileName.split('-');
    const prefix = dashSplit[0];
    const dotSplit = dashSplit[1].split('.');
    const suffix = dotSplit[0];

    fetch(filePath).then(file => file.text()).then(html => {
        const fragment = document.createRange().createContextualFragment(html);
        const scriptFragment = fragment.querySelector("script");
        const styleFragment = fragment.querySelector("style");
        const templateFragment = fragment.querySelector("template");

        customElements.define(`${prefix}-${suffix}`, class extends HTMLElement {
            static observedAttributes = ["data-state"];
            constructor() {
                super();
                this.attachShadow({ mode: "open" });
            }
            connectedCallback() {
                this.hostDataIDs = []; // the hostDataIDs are used to getDOM from the script
                this.dataset.id = Math.random().toString(16).substring(2, 8);
                let hostElement = this;
                while (hostElement && hostElement.dataset.id) {
                    this.hostDataIDs.push(hostElement.dataset.id);
                    hostElement = hostElement.getRootNode().host;
                }
                this.shadowRoot.replaceChildren();
                if (scriptFragment?.getAttributeNames().includes('prefer')) {
                    this.#appendScript();
                    this.#appendTemplate();
                    this.#appendStyle();
                } else {
                    this.#appendTemplate();
                    this.#appendStyle();
                    this.#appendScript();
                }
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (this.isConnected) {
                    if (oldValue != newValue) {
                        this.replaceWith(this.cloneNode(false)); // remove all listeners and reconstruct
                    }
                }
            }
            #createScript() {
                const scriptElement = document.createElement("script");
                scriptElement.setAttribute("type", "module");
                scriptElement.textContent = `
const shadowDocument = (function getDOM(hostDataIDs = '${this.hostDataIDs.toReversed().toString()}') {
let shadowDocument = document;
for (let hostDataID of hostDataIDs.split(',')) {
    const host = shadowDocument.querySelector('[data-id="' + hostDataID + '"]');
    if (host) {
        shadowDocument = host.shadowRoot;
    } else {
        return null;
    }
}
return shadowDocument;
})();

const $ = (query) => shadowDocument.querySelector(query);
const $$ = (query) => shadowDocument.querySelectorAll(query);
const state = shadowDocument.host.dataset.state ? JSON.parse(shadowDocument.host.dataset.state) : undefined;

${scriptFragment ? scriptFragment.textContent : ''}
`;
                return scriptElement;
            }
            #appendScript() {
                if (scriptFragment) {
                    let scriptElement = this.#createScript(); // TODO: compile template to use state
                    this.shadowRoot.appendChild(scriptElement);
                }
            }
            #appendStyle() {
                if (styleFragment) {
                    let clonedStyle = styleFragment.cloneNode(true);
                    this.shadowRoot.appendChild(clonedStyle);
                }
            }
            #appendTemplate() {
                if (templateFragment) {
                    let documentFragment = document.createRange().createContextualFragment(templateFragment.innerHTML)
                    this.shadowRoot.appendChild(documentFragment);
                }
            }
        });
    });
}
