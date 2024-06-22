import { sync } from "glob";

export const calculateFilePath = (filePattern: string): string[] => {
	return sync(filePattern, { ignore: "**/node_modules/**", absolute: true });
};
