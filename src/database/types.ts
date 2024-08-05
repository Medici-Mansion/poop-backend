import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { GraphicsCategory, GraphicType, Gender, SocialProvier, ToonType } from "./enums";

export type Breed = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    nameKR: string;
    nameEN: string | null;
    avatar: string | null;
};
export type Challenge = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    category: string;
    thumbnail: string;
    title: string;
    startDate: Timestamp;
    endDate: Timestamp;
};
export type Graphic = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    name: string;
    url: string;
    type: GraphicType;
    category: GraphicsCategory | null;
};
export type Profile = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    avatarUrl: string | null;
    name: string;
    birthday: Timestamp;
    gender: Generated<Gender>;
    breedId: string;
    userId: string;
};
export type Toon = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    title: string;
    toonImage: string;
    profileId: string;
    type: ToonType;
    challengeId: string | null;
};
export type ToonGraphic = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    toonId: string;
    graphicId: string;
};
export type User = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    password: string;
    userId: string;
    phone: string | null;
    birthday: Timestamp | null;
    verified: Timestamp | null;
    latestToken: string | null;
    provider: Generated<SocialProvier>;
    latestProfileId: string | null;
};
export type verification = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    code: string;
    userId: string;
};
export type DB = {
    breeds: Breed;
    Challenge: Challenge;
    graphics: Graphic;
    profiles: Profile;
    toon_assets: ToonGraphic;
    toons: Toon;
    users: User;
    verification: verification;
};
