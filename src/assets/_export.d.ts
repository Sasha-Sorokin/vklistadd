declare module "*.svg" {
	namespace DoNotImport {
		const base64: string;
	}

	export default DoNotImport.base64;
}
