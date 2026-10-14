import { execFile } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const executeFile = promisify(execFile);

export async function runCommand(
  command: string,
  commandArguments: readonly string[],
  workingDirectory?: string,
): Promise<string> {
  const { stdout } = await executeFile(command, [...commandArguments], {
    cwd: workingDirectory,
  });

  return stdout;
}

export async function findCommandVersion(
  command: string,
  versionArguments: readonly string[],
  versionPattern: RegExp,
): Promise<string | null> {
  try {
    const { stdout, stderr } = await executeFile(command, [
      ...versionArguments,
    ]);
    const output = `${stdout}${stderr}`;

    return versionPattern.exec(output)?.[1] ?? output.trim();
  } catch {
    return null;
  }
}

export async function withTemporaryDirectory<Result>(
  task: (directory: string) => Promise<Result>,
): Promise<Result> {
  const directory = await mkdtemp(join(tmpdir(), "algo-lab-snippet-"));

  try {
    return await task(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
