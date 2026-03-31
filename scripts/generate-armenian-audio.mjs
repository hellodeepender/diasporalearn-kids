// Generate Armenian audio files using Narakeet API (voice: nune)
// Usage: node scripts/generate-armenian-audio.mjs

import { readFileSync, writeFileSync } from "fs";

const API_KEY = "lgqet2j4cd5kO3qvPbwZc2AfTGHHWyqS8kdzAZDx";
const VOICE = "nune";
const DELAY_MS = 600;

const data = JSON.parse(readFileSync("scripts/armenian_data.json", "utf8"));

async function generateAudio(text, outputPath) {
  const url = `https://api.narakeet.com/text-to-speech/mp3?voice=${VOICE}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "x-api-key": API_KEY,
      "Content-Type": "text/plain",
      Accept: "application/octet-stream",
    },
    body: text,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outputPath, buffer);
  return buffer.length;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  let letterCount = 0;
  let wordCount = 0;
  const errors = [];

  console.log(`Generating audio for ${data.length} Armenian letters...\n`);

  for (let i = 0; i < data.length; i++) {
    const { letter, word } = data[i];

    // Letter audio
    try {
      process.stdout.write(
        `Generating letter ${i + 1}/${data.length}: ${letter}... `
      );
      const size = await generateAudio(
        letter,
        `assets/audio/hy/letters/letter_${i}.mp3`
      );
      console.log(`done (${(size / 1024).toFixed(1)}KB)`);
      letterCount++;
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      errors.push(`letter_${i} (${letter})`);
    }
    await sleep(DELAY_MS);

    // Word audio
    try {
      process.stdout.write(
        `  Generating word ${i + 1}/${data.length}: ${word}... `
      );
      const size = await generateAudio(
        word,
        `assets/audio/hy/words/word_${i}.mp3`
      );
      console.log(`done (${(size / 1024).toFixed(1)}KB)`);
      wordCount++;
    } catch (e) {
      console.log(`FAILED: ${e.message}`);
      errors.push(`word_${i} (${word})`);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n=== Summary ===`);
  console.log(`Generated ${letterCount} letter files, ${wordCount} word files`);
  if (errors.length > 0) {
    console.log(`Errors (${errors.length}):`);
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

main().catch(console.error);
