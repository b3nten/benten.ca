import { css, LitElement, type CSSResultGroup } from "lit";

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


		static styles: CSSResultGroup = css`
			.font-pixel {
				font-family:"Jersey 10";
			}

			.vignette {
	      box-shadow: inset 0px 0px 85px rgba(0, 0, 0, 0.4);
			}

			.border-pixels-8 {
	      clip-path: polygon(
					0px calc(100% - 10px),
					2px calc(100% - 10px),
					2px calc(100% - 6px),
					4px calc(100% - 6px),
					4px calc(100% - 4px),
					6px calc(100% - 4px),
					6px calc(100% - 2px),
					10px calc(100% - 2px),
					10px 100%,
					calc(100% - 10px) 100%,
					calc(100% - 10px) calc(100% - 2px),
					calc(100% - 6px) calc(100% - 2px),
					calc(100% - 6px) calc(100% - 4px),
					calc(100% - 4px) calc(100% - 4px),
					calc(100% - 4px) calc(100% - 6px),
					calc(100% - 2px) calc(100% - 6px),
					calc(100% - 2px) calc(100% - 10px),
					100% calc(100% - 10px),
					100% 10px,
					calc(100% - 2px) 10px,
					calc(100% - 2px) 6px,
					calc(100% - 4px) 6px,
					calc(100% - 4px) 4px,
					calc(100% - 6px) 4px,
					calc(100% - 6px) 2px,
					calc(100% - 10px) 2px,
					calc(100% - 10px) 0px,
					10px 0px,
					10px 2px,
					6px 2px,
					6px 4px,
					4px 4px,
					4px 6px,
					2px 6px,
					2px 10px,
					0px 10px
        );
			}

			.border-pixels-6 {
			  clip-path: polygon(
					0px calc(100% - 8px),
					2px calc(100% - 8px),
					2px calc(100% - 4px),
					4px calc(100% - 4px),
					4px calc(100% - 2px),
					8px calc(100% - 2px),
					8px 100%,
					calc(100% - 8px) 100%,
					calc(100% - 8px) calc(100% - 2px),
					calc(100% - 4px) calc(100% - 2px),
					calc(100% - 4px) calc(100% - 4px),
					calc(100% - 2px) calc(100% - 4px),
					calc(100% - 2px) calc(100% - 8px),
					100% calc(100% - 8px),
					100% 8px,
					calc(100% - 2px) 8px,
					calc(100% - 2px) 4px,
					calc(100% - 4px) 4px,
					calc(100% - 4px) 2px,
					calc(100% - 8px) 2px,
					calc(100% - 8px) 0px,
					8px 0px,
					8px 2px,
					4px 2px,
					4px 4px,
					2px 4px,
					2px 8px,
					0px 8px
        );
			}

			.border-pixels-4 {
	      clip-path: polygon(
          0px calc(100% - 4px),
          2px calc(100% - 4px),
          2px calc(100% - 2px),
          4px calc(100% - 2px),
          4px 100%,
          calc(100% - 4px) 100%,
          calc(100% - 4px) calc(100% - 2px),
          calc(100% - 2px) calc(100% - 2px),
          calc(100% - 2px) calc(100% - 4px),
          100% calc(100% - 4px),
          100% 4px,
          calc(100% - 2px) 4px,
          calc(100% - 2px) 2px,
          calc(100% - 4px) 2px,
          calc(100% - 4px) 0px,
          4px 0px,
          4px 2px,
          2px 2px,
          2px 4px,
          0px 4px
        );
			}

			.border-pixels-2 {
				clip-path: polygon(
					0px calc(100% - 6px),
					6px calc(100% - 6px),
					6px 100%,
					calc(100% - 6px) 100%,
					calc(100% - 6px) calc(100% - 6px),
					100% calc(100% - 6px),
					100% 6px,
					calc(100% - 6px) 6px,
					calc(100% - 6px) 0px,
					6px 0px,
					6px 6px,
					0px 6px
				);
			}
		`

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
