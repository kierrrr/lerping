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

  await fs.writeFile(path.join(process.cwd(), "/data/vocab.csv"), vocabCSV);
  console.log("DONE");
} catch (err) {
  console.error(err);
}
