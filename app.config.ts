import { Application, BuildTargets } from "@100x/application";
import react from "@100x/react/plugin";
import tailwindcss from "@tailwindcss/vite";

export default Application(
  ({ buildFor, plugin, vitePlugin, serverEntry, clientEntry }) => {
    buildFor(BuildTargets.Cloudflare);
    serverEntry("src/serverMain/main");
    clientEntry("src/clientMain/main");
    plugin(react);
    vitePlugin(tailwindcss());
  },
);
