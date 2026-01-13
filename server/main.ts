import manifest from "virtual:vite-manifest";

const html = String.raw;

export const createShell = (props: Record<string, string>) => html`
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            ${import.meta.env.DEV
                ? "<script type='module' src='/@vite/client'></script>"
                : ""}
            ${manifest["client/main.js"]?.css
                ?.map((css) => `<link rel="stylesheet" href="${css}">`)
                .join("\n") ?? ""}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
                rel="preconnect"
                href="https://fonts.gstatic.com"
                crossorigin
            />
            <link
                href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap"
                rel="stylesheet"
            />
            <script
                type="module"
                src="${manifest["client/main.js"].file}"
            ></script>
            ${props.head ?? ""}
        </head>
        <body></body>
    </html>
`;

export default async function run() {
    return new Response(createShell({}), {
        headers: {
            "Content-Type": "text/html",
        },
    });
}
