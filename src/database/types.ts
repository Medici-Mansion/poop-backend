import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { GraphicsCategory, GraphicType, Gender } from "./enums";

export type Breed = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    nameKR: string;
    nameEN: string | null;
    avatar: string | null;
};
export type Graphics = {
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
export type User = {
    id: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    deletedAt: Timestamp | null;
    password: string;
    nickname: string;
    phone: string;
    birthday: Timestamp;
    verified: Timestamp | null;
    latestToken: string | null;
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
    graphics: Graphics;
    profiles: Profile;
    users: User;
    verification: verification;
};
