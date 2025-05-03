import fs from "node:fs/promises";
import path from "path";

try {
  const vocabPathFile = path.join(process.cwd(), "/data/vocab.txt");
  const vocabData = await fs.readFile(vocabPathFile, { encoding: "utf8" });

  const vocabCSV = vocabData
    .replace("#separator:tab\n", "")
    .replace("#html:false\n", "")
    .split("\n")
    .map((line) =>
      line
        .replace(/ {2}.*$/, "")
        .replaceAll(";", "/")
        .replaceAll(",", "/")
        .replace("\t", ","),
    )
    .join("\n");

  const vocabJSON = Object.fromEntries(
    vocabData
      .replace("#separator:tab\n", "")
      .replace("#html:false\n", "")
      .trimEnd()
      .split("\n")
      .map((line) =>
        line
          .replace(/ {2}.*$/, "")
          .replaceAll(";", "/")
          .replaceAll(",", "/")
          .replace("\t", ",")
          .split(","),
      ),
  );

  await fs.writeFile(path.join(process.cwd(), "/data/vocab.csv"), vocabCSV);
  await fs.writeFile(
    path.join(process.cwd(), "/data/vocab.json"),
    JSON.stringify(vocabJSON, null, 2),
  );
  console.log("DONE");
} catch (err) {
  console.error(err);
}
