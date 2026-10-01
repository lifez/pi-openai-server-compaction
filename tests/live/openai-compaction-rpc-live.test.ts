import assert from "node:assert/strict";
import { assistantText, chooseAltModel } from "./openai-compaction-rpc-live.ts";

const models = ["gpt-6.1-sol", "gpt-5.4-mini", "gpt-5.5"].map((id) => ({
  provider: "openai-codex",
  api: "openai-codex-responses",
  id,
}));
assert.equal(chooseAltModel(models, "openai-codex", "gpt-6.1-sol")?.id, "gpt-5.5");
assert.equal(chooseAltModel(models, "openai-codex", "gpt-5.5")?.id, "gpt-6.1-sol");
assert.equal(chooseAltModel([models[0]], "openai-codex", "gpt-6.1-sol"), undefined);
assert.equal(chooseAltModel(models.map((model) => ({
  ...model, provider: "openai", api: "openai-responses",
})), "openai", "gpt-6.1-sol")?.id, "gpt-5.4-mini");

assert.equal(assistantText([
  { role: "assistant", content: [{ type: "text", text: "SWITCHED-OK" }], stopReason: "stop" },
]), "SWITCHED-OK");
assert.throws(() => assistantText([
  { role: "assistant", content: [{ type: "text", text: "old answer" }] },
  {
    role: "assistant", provider: "openai-codex", model: "gpt-5.4-mini",
    content: [], stopReason: "error",
    errorMessage: "Model is not supported when using Codex with a ChatGPT account.",
  },
]), /openai-codex\/gpt-5\.4-mini.*not supported/);
console.log("live test helpers ok");
