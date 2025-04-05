import fs from "fs/promises";

const INFO_FROM  = "info";
const ERROR_FROM = "error";
const WARN_FROM  = "warning";

let fileOut = "";

function setOutputFile(filename: string) {
	fileOut = filename;
}

function display(from: string, ...args: any[]) {

	console.log(`[${from}]:`, ...args);
	if (fileOut !== "") {
		fs.appendFile(fileOut, `[${from}]: ${args.join(" ")}`)
			.catch((reason: any) => {
				setOutputFile("");
				display(ERROR_FROM, "failed to write to log file, clearing output file.", reason);
			});
	}
}

export default {
	info: (...args: any[]) => display(INFO_FROM, ...args),
	error: (...args: any[]) => display(ERROR_FROM, ...args),
	warn: (...args: any[]) => display(WARN_FROM, ...args),

	log: (source: string, ...args: any[]) => display(source, ...args),

	setLogFile: setOutputFile,
	unsetLogFile: () => setOutputFile(""),
}
