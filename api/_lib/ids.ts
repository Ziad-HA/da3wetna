import { randomBytes, randomInt } from "node:crypto"

const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789" // من غير حروف متشابهة

export function inviteId(): string {
  let out = ""
  for (let i = 0; i < 8; i++) out += ALPHABET[randomInt(ALPHABET.length)]
  return out
}

export const orderId = () => `DA3-${randomInt(100000, 999999)}`
export const ownerToken = () => randomBytes(24).toString("base64url")
