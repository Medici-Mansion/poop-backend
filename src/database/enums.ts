export const GraphicsCategory = {
    Message: "Message",
    Sticker: "Sticker",
    Challenge: "Challenge"
} as const;
export type GraphicsCategory = (typeof GraphicsCategory)[keyof typeof GraphicsCategory];
export const GraphicType = {
    Lottie: "Lottie",
    GIF: "GIF"
} as const;
export type GraphicType = (typeof GraphicType)[keyof typeof GraphicType];
export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    NONE: "NONE"
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
export const SocialProvier = {
    APPLE: "APPLE",
    GOOGLE: "GOOGLE",
    KAKAO: "KAKAO",
    CREDENTIAL: "CREDENTIAL"
} as const;
export type SocialProvier = (typeof SocialProvier)[keyof typeof SocialProvier];
