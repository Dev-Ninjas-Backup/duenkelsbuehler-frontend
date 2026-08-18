import { SP } from "./types";

export const MOCK_SPS: SP[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: "Vanessa R.",
  handle: "@Vanessa92",
  avatar: "/images/user/user_avatar.png",
  verified: i % 3 !== 0,
}));
