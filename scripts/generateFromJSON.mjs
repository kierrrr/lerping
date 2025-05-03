import fs from "node:fs/promises";
import path from "path";

const NUM_OF_FLASHCARDS_PER_PATTERN = 2;

try {
  const vocabPathFile = path.join(process.cwd(), "/data/vocab.json");
  const patternsPathFile = path.join(process.cwd(), "/data/patterns.json");
  const promptConversationFile = path.join(
    process.cwd(),
    "/data/promptConversationEnglishReply.txt",
  );

  const [vocabData, patternsData, promptConversationData] = await Promise.all([
    fs.readFile(vocabPathFile, { encoding: "utf8" }),
    fs.readFile(patternsPathFile, {
      encoding: "utf8",
    }),
    fs.readFile(promptConversationFile, { encoding: "utf8" }),
  ]);

  const vocabObj = JSON.parse(vocabData);
  const numberOfVocab = Object.keys(vocabObj).length;
  const patternsObj = JSON.parse(patternsData);
  const numberOfPatterns = Object.keys(patternsObj).length;

  const finalPromptConversation = promptConversationData
    .replaceAll("{{vocab_num}}", numberOfVocab)
    .replaceAll("{{vocab}}", vocabData)
    .replaceAll("{{patterns}}", patternsData)
    .replaceAll("{{flashcards_num}}", NUM_OF_FLASHCARDS_PER_PATTERN)
    .replaceAll("{{patterns_num}}", numberOfPatterns)
    .replaceAll(
      "{{flashcards_total}}",
      numberOfPatterns * NUM_OF_FLASHCARDS_PER_PATTERN,
    )
    .replace("{{epoch}}", Date.now());

  await fs.writeFile(
    path.join(process.cwd(), "/output/promptConversation.txt"),
    finalPromptConversation,
  );
  console.log("DONE");
} catch (err) {
  console.error(err);
}
