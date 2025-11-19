// @ts-expect-error
import server from "../dist/main"

export default {
	fetch: server.fetch
}
