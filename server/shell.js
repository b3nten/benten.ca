import manifest from "virtual:vite-manifest";
const html = String.raw

/** @param {Record<string, any>} props */
export const createShell = (props) => html`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			${import.meta.env.DEV ? "<script type='module' src='/@vite/client'></script>" : ""}
			${manifest['client/main.js']?.let(it => it.css?.map((css) => `<link rel="stylesheet" href="${css}">`).join('')) ?? ""}
			<script type="module" src="${manifest['client/main.js'].file}"></script>
			${props.head ?? ""}
		</head>
		<body>
			<app-root></app-root>
		</body>
	</html>
`
