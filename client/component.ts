import { LitElement } from "lit";

let globalSheets: CSSStyleSheet[] | null = null;

function getGlobalStyleSheets()
{
	if (globalSheets === null) {
		globalSheets = Array.from(document.styleSheets).map((x) => {
			const sheet = new CSSStyleSheet();
			const css = Array.from(x.cssRules)
				.map((rule) => rule.cssText)
				.join(" ");
			sheet.replaceSync(css);
			return sheet;
		});
	}
	return globalSheets;
}

/**
 * @param {string} tag Optional tag to override the default tag name
 */
export function WebComponent(tag: string)
{
	class ComponentImpl extends LitElement
	{
		static define(maybeTag?: string)
		{
			queueMicrotask(() => {
				if(!customElements.get(tag)) {
					customElements.define(maybeTag ?? tag, this);
				}
			});
		}

		constructor()
		{
			super();
			if (this.shadowRoot)
			{
				this.shadowRoot.adoptedStyleSheets.push(...getGlobalStyleSheets());
			}
		}

		onMount() {}
		onMounted() {}
		onUpdate() {}
		onUpdated() {}
		onUnmount() {}

		connectedCallback()
		{
			super.connectedCallback();
			this.onMount();
		}

		firstUpdated()
		{
			this.onMounted()
		}

		willUpdate()
		{
			this.onUpdate()
		}

		updated()
		{
			this.onUpdated()
		}

		disconnectedCallback()
		{
			super.disconnectedCallback();
			this.onUnmount();
		}
	};

	return ComponentImpl;
}
