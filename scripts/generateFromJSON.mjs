import fs from "node:fs/promises";
import path from "path";

const shuffle = (array) =>
  array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const shuffleObject = (obj, takeAmount) => {
  const array = Object.entries(obj);
  return Object.fromEntries(shuffle(array).slice(0, takeAmount));
};

try {
  const vocabPathFile = path.join(process.cwd(), "/data/vocab.json");
  const patternsPathFile = path.join(process.cwd(), "/data/patterns.json");
  const promptConversationFile = path.join(
    process.cwd(),
    "/data/promptConversationEnglishReply.txt",
  );
  const promptGameFile = path.join(process.cwd(), "/data/promptGame.txt");

  const [vocabData, patternsData, promptConversationData, promptGameData] =
    await Promise.all([
      fs.readFile(vocabPathFile, { encoding: "utf8" }),
      fs.readFile(patternsPathFile, {
        encoding: "utf8",
      }),
      fs.readFile(promptConversationFile, { encoding: "utf8" }),
      fs.readFile(promptGameFile, { encoding: "utf8" }),
    ]);

  const vocabObj = JSON.parse(vocabData);
  const numberOfVocab = Object.keys(vocabObj).length;
  const patternsObj = JSON.parse(patternsData);
  const numberOfPatterns = Object.keys(patternsObj).length;

  const finalPromptConversation = promptConversationData
    .replaceAll("{{vocab_num}}", numberOfVocab)
    .replaceAll("{{vocab}}", vocabData)
    .replaceAll("{{patterns}}", patternsData)
    .replaceAll("{{patterns_num}}", numberOfPatterns)
    .replace("{{epoch}}", Date.now());

  const shuffledVocabObj = shuffleObject(vocabObj, 100);
  const shuffledNumberOfVocab = Object.keys(shuffledVocabObj).length;
  const shuffledPatternsObj = shuffleObject(patternsObj, 10);
  const shuffledNumberOfPatterns = Object.keys(shuffledPatternsObj).length;

  const finalPromptGame = promptGameData
    .replaceAll("{{vocab_num}}", shuffledNumberOfVocab)
    .replaceAll("{{vocab}}", JSON.stringify(shuffledVocabObj, null, 2))
    .replaceAll("{{patterns}}", JSON.stringify(shuffledPatternsObj, null, 2))
    .replaceAll("{{patterns_num}}", shuffledNumberOfPatterns)
    .replace("{{epoch}}", Date.now());

  await fs.writeFile(
    path.join(process.cwd(), "/output/promptConversation.txt"),
    finalPromptConversation,
  );

  await fs.writeFile(
    path.join(process.cwd(), "/output/promptGame.txt"),
    finalPromptGame,
  );
  console.log("DONE");
} catch (err) {
  console.error(err);
}
