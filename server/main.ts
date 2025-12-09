import "../shared/scope"
import { AutoRouter, html as asHtml } from "itty-router";
import { createShell } from "./shell";

const router = AutoRouter()

router.get("*", () => asHtml(createShell({})))

export default router
