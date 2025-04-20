import fs from "node:fs/promises";
import path from "path";

const NUM_OF_FLASHCARDS_PER_PATTERN = 3;

try {
  const vocabPathFile = path.join(process.cwd(), "/data/vocab.csv");
  const patternsPathFile = path.join(process.cwd(), "/data/patterns.csv");
  const promptPathFile = path.join(process.cwd(), "/data/prompt.txt");

  const [vocabData, patternsData, promptData] = await Promise.all([
    fs.readFile(vocabPathFile, { encoding: "utf8" }),
    fs.readFile(patternsPathFile, {
      encoding: "utf8",
    }),
    fs.readFile(promptPathFile, { encoding: "utf8" }),
  ]);

  const numberOfPatterns = patternsData.split("\n").length - 1;

  const finalPrompt = promptData
    .replace("{{vocab}}", vocabData)
    .replace("{{patterns}}", patternsData)
    .replace("{{flashcards_num}}", NUM_OF_FLASHCARDS_PER_PATTERN)
    .replace("{{patterns_num}}", numberOfPatterns)
    .replace(
      "{{flashcards_total}}",
      numberOfPatterns * NUM_OF_FLASHCARDS_PER_PATTERN,
    )
    .replace("{{epoch}}", Date.now());

  await fs.writeFile(
    path.join(process.cwd(), "/output/prompt.txt"),
    finalPrompt,
  );
  console.log("DONE");
} catch (err) {
  console.error(err);
}
