export default {
	collectCoverageFrom: ["src/**/!(*.d).ts"],
	restoreMocks: true,
	testEnvironment: "node",
	transform: {
		"^.+\\.[tj]s$": [
			"@swc/jest",
			{
				jsc: {
					parser: { decorators: true, syntax: "typescript" },
					target: "es2022",
					transform: { decoratorMetadata: true, legacyDecorator: true },
				},
				module: { type: "commonjs" },
			},
		],
	},
	transformIgnorePatterns: ["/node_modules/(?!.*@faker-js)"],
};
