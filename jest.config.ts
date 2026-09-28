export default {
	collectCoverageFrom: ["src/**/!(*.d).ts"],
	preset: "ts-jest",
	restoreMocks: true,
	testEnvironment: "node",
};
