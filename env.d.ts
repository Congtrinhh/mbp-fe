/// <reference types="vite/client" />

declare module "*.vue" {
	import type { DefineComponent } from "vue";
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

// Ensure TS sees @ as a module namespace
declare module "@/*" {
	const content: any;
	export default content;
}
