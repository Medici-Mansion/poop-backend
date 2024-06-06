export const Gender = {
    MALE: "MALE",
    FEMALE: "FEMALE",
    NONE: "NONE"
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
